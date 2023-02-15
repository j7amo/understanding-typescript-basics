abstract class Department {
    static fiscalYear = 2023;
    // private readonly id: string; // we can use shorthand initialization if we want to save some memory (see (4))
    // private readonly name: string;
    // private employees: string[] = []; // PRIVATE helps us to avoid direct access to class field FROM OUTSIDE the class! (see (3))

    // PROTECTED class fields are NOT accessible from outside the class
    // BUT can be accessed / overridden in subclasses. So this gives us some flexibility AND protection at the same time.
    protected employees: string[] = [];

    constructor (private readonly id: string, private readonly name: string) { // (4) this instruction tells TS to create fields for us and to set them in the future
        // this.id = id;
        // this.name = name;
    }
    // (1) we can explicitly specify type for THIS so TS will help us identify error early
    // when we are trying to call an object method in the incompatible context (please see (2))
    // describe(this: Department) {
    //     console.log(`Department name: ${this.name}`);
    //     console.log(`Department id: ${this.id}`);
    // }

    abstract describe(): number;

    addEmployee(employee: string) {
        // this.id = 'd2'; this won't work as 'id' is READONLY property and can only be initialized at instantiation time
        this.employees.push(employee);
    }

    static createEmployee(name: string): { name: string} {
        return { name: name };
    }

    printEmployeesInfo() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    admins: string[];
    constructor(id: string, admins: string[]) {
        super(id, 'IT');
        this.admins = admins;
    }

    describe(): number {
        return 123;
    }
}

class AccountingDepartment extends Department {
    private _lastReport: string;
    private static instance: AccountingDepartment;

    get lastReport() {
        if (this._lastReport) {
            return this._lastReport;
        }

        throw new Error('No reports found!');
    }

    set lastReport(value: string) {
        if (!value) {
            throw new Error('Invalid value passed!');
        }
        this.addReport(value);
    }

    private constructor(id: string, private reports: string[]) {
        super(id, 'Accounting');
        this._lastReport = reports[0];
    }

    static getInstance(id: string, reports: string[]): AccountingDepartment {
        if (!AccountingDepartment.instance) {
            AccountingDepartment.instance = new AccountingDepartment(id, reports);
        }

        return AccountingDepartment.instance;
    }

    addReport(text: string) {
        this.reports.push(text);
        this._lastReport = text;
    }

    addEmployee(employee: string) {
        this.employees.push(employee); // won't work if 'employees' was 'private'
    }

    describe(): number {
        return 456;
    }

    printReports() {
        console.log(this.reports);
    }
}

const employee1 = Department.createEmployee('Roma');
console.log(employee1, Department.fiscalYear);

const itDepartment = new ITDepartment('d1', ['Jenya', 'Roma']);
console.log(itDepartment);
itDepartment.describe();

itDepartment.addEmployee('Vasya');
itDepartment.addEmployee('Petya');
// (3) we can't directly access the object field if it is private in corresponding class
// accounting.employees[1] = 'Kolya'; // Property 'employees' is private and only accessible within class 'Department'
itDepartment.printEmployeesInfo();

// here is a classic example of THIS's dynamic nature
// const fakeAccounting = { describe: accounting.describe };
// fakeAccounting.describe();// THIS will be referring to fakeAccounting.name which is nonexistent thus resulting in 'undefined'
// to have more control over such cases we can use some TS built-in features (please see (1))
// fakeAccounting.describe(); // (2) here TS will tell us that 'fakeAccounting' object doesn't have 'name' property because
// THIS inferred types from 'Department' class
// in order to fix it we have to provide a compatible object with all needed fields:
// const fakeAccounting = { name: 'Vasya', describe: accounting.describe };
// fakeAccounting.describe();
const accountingDepartment = AccountingDepartment.getInstance('d2', []);
const accountingDepartment2 = AccountingDepartment.getInstance('d3', []);
console.log(accountingDepartment === accountingDepartment2);
console.log(accountingDepartment);
accountingDepartment.addReport('Report 3');
accountingDepartment.printReports();
console.log(accountingDepartment.lastReport);

// now when we have GETTER and SETTER for _lastReport we can work with this field like this:
accountingDepartment.lastReport = '123';
console.log(accountingDepartment.lastReport);
