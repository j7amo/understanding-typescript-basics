type Admin = {
    name: string;
    privileges: string[];
}

type Employee = {
    name: string;
    startDate: Date;
}

// & - is an INTERSECTION operator
// 1) when we use it in conjunction with object types (like Admin / Employee) we are simply unite everything
// that these types have ('name' + 'startDate' + 'privileges')
type ElevatedEmployee = Employee & Admin;

const e1: ElevatedEmployee = {
    name: 'Vasya',
    startDate: new Date(),
    privileges: ['Hacking'],
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInfo(employee: UnknownEmployee) {
    console.log(employee.name);
    // we CANNOT do this:
    // if (typeof employee === 'Admin') {} // because this will work in the runtime an JS doesn't know anything about custom types
    // we also CANNOT do this:
    // if (employee.privileges) {} // because TS will not let us do it
    if ('privileges' in employee) { // this WORKAROUND is a TYPE GUARD
        console.log(employee.privileges);
    }

    if ('startDate' in employee) { // this WORKAROUND is a TYPE GUARD
        console.log(employee.startDate)
    }
}

const unknownEmployee: UnknownEmployee = {
    name: 'Petya',
    startDate: new Date(),
}

printEmployeeInfo(unknownEmployee);

// 2) but when we use INTERSECTION operator with primitive types
type t1 = number;
type t2 = string;
type t3 = t1 & t2; // we cannot have this! as 'number' and 'string' have NO intersection!
// const smth: t3 = 3; // Type 'number' is not assignable to type 'never'.

type t4 = string | number;
type t5 = number | boolean;
type t6 = t4 & t5; // we CAN use this as number IS the intersection (is what these types have in common)
const smth: t6 = 123; // this works OK!

type Combinable = string | number;
type Numeric = number | boolean;

// FUNCTION OVERLOADS
function add(a: number, b: number): number;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: string, b: string): string;
function add(a: Combinable, b: Combinable) {
    if (typeof a === 'string' || typeof b === 'string') { // this is a TYPE GUARD for primitives
        return a.toString() + b.toString();
    }

    return a + b;
}

// as we have all overloads TS can now know exactly what result's type is
const result = add(1, 5);
const result1 = add(1, '5');

// OPTIONAL CHAINING
const fetchedUserInfo = {
    id: 'id1',
    name: 'Roman',
    job: {
        title: 'Software Engineer',
        company: 'EPAM'
    }
}

console.log(fetchedUserInfo?.job?.title);


class Car {
    drive() {
        console.log('Driving a car...');
    }
}

class Truck {
    drive() {
        console.log('Driving a truck...')
    }

    loadCargo(amount: number) {
        console.log('Loading cargo ' + amount);
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();

    // we can use again the TYPE GUARD approach with 'in' operator and it will work
    // if ('loadCargo' in vehicle) {
    // but the more elegant way of doing it in context of classes is to use 'instanceof' operator:
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(123);
    }
}

useVehicle(v1);
useVehicle(v2);

// so the main point of using the TYPE GUARDS ('typeof' operator for primitives, 'in' and 'instanceof' operators for objects)
// is to have an approach for
// 1) checking what exact type we have
// 2) doing something with this type depending on what this exact type is capable of
// And one more thing: TYPE GUARDS are running during RUNTIME, and we have to do them in pure JS way.
// TS can't help us here unfortunately as it's custom types/interfaces are not compiled to JS.

interface Bird {
    type: 'bird'; // (1) this property is of literal type, and we can use it to check what type we;re working with at runtime
    flyingSpeed: number;
}

interface Horse {
    type: 'horse';
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
    // of course, we can do it using 'IN' operator as it is a case of typed objects
    if ('flyingSpeed' in animal) {
        console.log('Moving with speed of... ' + animal.flyingSpeed);
    } else if ('runningSpeed' in animal) {
        console.log('Moving with speed of... ' + animal.runningSpeed);
    }
    // but we can also do it with the help of DISCRIMINATED UNIONS
    // when we have several types/interfaces with one common property (see (1)) to check for
    let speed: number;
    switch (animal.type) {
        case 'bird':
            speed = animal.flyingSpeed;
            break;
        case 'horse':
            speed = animal.runningSpeed;
            break;
    }
    console.log('Moving with speed of... ' + speed);
}

const animal: Bird = {
    type: 'bird',
    flyingSpeed: 100,
}

moveAnimal(animal);

// TYPECASTING
// const paragraph = document.querySelector('p'); // TS sees 'p' and knows that it is a HTMLParagraphElement
// const possiblyParagraph = document.getElementById('#message-output'); // TS doesn't know if it is a HTMLParagraphElement anymore!

// to tell TS what type we are using explicitly we can use 2 different syntax's of Type Casting
// 1) This approach works fine INSIDE React code
const paragraphForSure = document.getElementById('#message-output') as HTMLParagraphElement; // now TS knows 100%!

// 2) This approach is not good for React as <> angle brackets are used for JSX
const userInputElement = <HTMLInputElement>document.getElementById('#user-input');
userInputElement.value = 'Hi!';

// INDEX TYPES
interface ErrorContainer {
    [prop: string]: string; // this means that object of this type can have
    // ANY number of properties, but they can only be a string (or any name that can be converted to a string) and have a string value
    // id: number; // this won't work!
}

const errorBag1: ErrorContainer = {}; // this will work! We don't have to add any props at all if we want to!

const errorBag2: ErrorContainer = {
    email: 'Not a valid EMAIL!',
    // code: 123, // this won't work! We can have as many props as we want, but they should comply with INDEX TYPE
    userName: 'Must start with a capital letter!'
}



export {};