// DECORATORS

// let's create our first Decorator function
// it receives a constructor as an argument (although we don't explicitly pass it ourselves)
function Logger(constructor: Function) {
    console.log('Logging from Logger');
    console.log(constructor);
}

// to make things more advanced we can write Decorator Factory which is basically a function that RETURNS a Decorator
// why do we need it? to let Decorator use additional arguments which are not connected to Decorated class at all (e.g.
// in this case 'logString' parameter is not found on a Decorated class itself, but we pass it explicitly when Decorating a class)
function LoggerFactory(logString: string) {
    return function(constructor: Function) {
        console.log(logString);
        console.log(constructor);
    }
}

// even more advanced (Angular-like) Decorator
function WithTemplate(template: string, hookId: string) {
    // good luck understanding the next line...
    return function<T extends { new(...args: any[]): { name: string } }>(originalConstructor: T) {
        // one approach is to make this whole rendering logic work WITHOUT any class instances
        // console.log('Rendering template!');
        // const element = document.getElementById(hookId);
        // const p = new originalConstructor();
        // if (element) {
        //     element.innerHTML = template;
        //     element.querySelector('h1')!.textContent = p.name;
        // }

        // because WithTemplate is a Decorator which we add to a class we can return a NEW class from it and replace OLD constructor.
        // basically a Class is a 'syntactic sugar' for a constructor function after all...
        // to keep all the props of class which we receive (and then modify and return a new one) we must extend its 'constructor'
        return class extends originalConstructor {
            // another approach is to put this whole rendering logic inside a constructor
            // for it to work ONLY when we instantiate a class
            constructor(...args: any[]) {
                super(); // here we instantiate the OLD class
                // AND start adding NEW functionality to a constructor
                console.log('Rendering template!');
                const element = document.getElementById(hookId);
                if (element) {
                    element.innerHTML = template;
                    element.querySelector('h1')!.textContent = this.name; // we can use 'this'
                }
            }
        }
    }
}

// interestingly Decorator is invoked even WITHOUT instantiating of Person
// we can also add multiple decorators to a class and the call order will be 'from bottom to up':
// (1) - WithTemplate
// (2) - LoggerFactory
// (3) - Logger
// BUT! If we are talking about Decorator Factories then they are called in the classic 'up to bottom' order:
// (1) - LoggerFactory()
// (2) - WithTemplate()
// p.s. Logger is not a Decorator Factory, so it has no place in this list
@Logger
@LoggerFactory('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
    name = 'Vasya';

    constructor() {
        console.log('Creating a new Person!');
    }
}

// instantiating does not affect the invocation of Decorators because they are called ONLY when we define a class
// BUT because WithTemplate decorator now returns a new class, and all the useful stuff is going on in this new class constructor
// we NEED to instantiate it:
const person = new Person();

// we can add Decorators to other places
// 1) To a property. In this case Decorator will implicitly(?) receive:
// - target
// - name
function PropertyLoggger(target: any, name: string | Symbol) {
    console.log('Property Decorator!');
    console.log(target, name);
}
// 2) To an accessor. In this case Decorator will implicitly(?) receive:
// - target
// - name
// - propDescriptor
function AccessorLogger(target: any, name: string | Symbol, propDescriptor: PropertyDescriptor) {
    console.log('Accessor Decorator!');
    console.log(target, name);
    console.log(propDescriptor);
}

// 3) To a method. In this case Decorator will implicitly(?) receive:
// - target
// - name
// - propDescriptor
function MethodLogger(target: any, name: string | Symbol, propDescriptor: PropertyDescriptor) {
    console.log('Method Decorator!');
    console.log(target, name);
    console.log(propDescriptor);

    // we can for example return a new PropertyDescriptor
    return {};
}

// 4) To a method parameter. In this case Decorator will implicitly(?) receive:
// - target
// - name
// - position (index of parameter)
function MethodParameterLogger(target: any, name: string | Symbol, position: number) {
    console.log('Method Parameter Decorator!');
    console.log(target, name);
    console.log(position);
}

class Product {
    // we can add Decorator to a property
    @PropertyLoggger
    title: string;
    private _price: number;

    // we can add Decorator to an accessor property AND it can RETURN a value which can be used by TS
    @AccessorLogger
    set price(value: number) {
        if (value > 0) {
            this._price = value;
        } else {
            throw new Error('Invalid price - should be a positive number');
        }
    }

    get price() {
        return this._price;
    }

    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;
    }

    // we can add Decorator to a method property AND it can RETURN a value which can be used by TS
    @MethodLogger
    getPriceWithTax(@MethodParameterLogger tax: number) { // // we can add Decorator to a method parameter
        console.log(`Price with tax included: ${this._price * ((this._price/100) * tax)}`);
    }
}

// to solve the problem with 'this' binding TS-way we can make another Decorator which we can later
// use with ANY class method to 100% bind 'this' to a class instance and not lose it later
function Autobind(target: any, methodName: string | Symbol, propDescriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = propDescriptor.value;

    return {
        configurable: true,
        // in the original propDescriptor we have a 'value' prop which gets executed when we call this method.
        // BUT here we want to add some new logic(binding) BEFORE execution and that's why we use GETTER
        get() {
            return originalMethod.bind(this);
        },
        enumerable: false,
    };
}

class Printer {
    message = 'It works!';

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const printer = new Printer();

const button = document.querySelector('button')!;
// At first this won't work because 'this' will point to global object
// But AFTER using Autobind Decorator it works as expected!
button.addEventListener('click', printer.showMessage);
// to fix it in Vanilla JS way we can do one of 2 things:
// button.addEventListener('click', printer.showMessage.bind(printer)); // this will work because 'this' will point to 'printer'
// OR
// button.addEventListener('click', () => printer.showMessage()); // this will work too because 'this' will point to 'printer'

// Validation Decorators Example
// Let's start with describing an interface for Validators Storage which will be accessed later by 'validate' function
interface ValidatorConfig {
    // basically we need to store all registered validators for a specific class so the 'key' here will be a class NAME
    [property: string]: {
        // and here will have an array of registered validators
        [propsToValidate: string]: string[]; // e.g. 'required', 'positive' etc.
    }
}

const registeredValidators: ValidatorConfig = {};

// 'Required' and 'PositiveNumber' Decorators will register validators for props they are attached to (or called upon)
function Required(target: any, propName: string) {
    // target.constructor.name - basically means that we get 'Course' in the end
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        // we do this ugly logic to ensure that we don't lose any already registered validators for a specific prop
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required'],
    };
}

function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        // we do this ugly logic to ensure that we don't lose any already registered validators for a specific prop
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive'],
    };
}

// the validation logic will go here:
function validate(obj: any): boolean {
    // we reach to the validators storage and get everything we have for a specific class
    const validatorsConfig = registeredValidators[obj.constructor.name];

    // if nothing is there then we assume that we have no validation needed
    if (!validatorsConfig) {
        return true;
    }

    let isValid = true;

    // if there are some registered validators then we loop through them and do some simple checking upon object values
    for (const prop in validatorsConfig) {
        for (const validator of validatorsConfig[prop]) {
            switch(validator) {
                case 'required':
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }

    return isValid;
}

class Course {
    // so these 2 decorators are already working even without class instance
    // which means that we have already registered validators for these properties!
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const form = document.querySelector('form')!;
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const titleElement = document.getElementById('title') as HTMLInputElement;
    const priceElement = document.getElementById('price') as HTMLInputElement;

    const title = titleElement.value;
    const price = Number(priceElement.value);

    const createdCourse = new Course(title, price);
    if (!validate(createdCourse)) {
        alert('Invalid input! Please try again!');

        return;
    }
    console.log(createdCourse);
});

export {}