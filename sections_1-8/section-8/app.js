"use strict";
// DECORATORS
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// let's create our first Decorator function
// it receives a constructor as an argument (although we don't explicitly pass it ourselves)
function Logger(constructor) {
    console.log('Logging from Logger');
    console.log(constructor);
}
// to make things more advanced we can write Decorator Factory which is basically a function that RETURNS a Decorator
// why do we need it? to let Decorator use additional arguments which are not connected to Decorated class at all (e.g.
// in this case 'logString' parameter is not found on a Decorated class itself, but we pass it explicitly when Decorating a class)
function LoggerFactory(logString) {
    return function (constructor) {
        console.log(logString);
        console.log(constructor);
    };
}
// even more advanced (Angular-like) Decorator
function WithTemplate(template, hookId) {
    // good luck understanding the next line...
    return function (originalConstructor) {
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
            constructor(...args) {
                super(); // here we instantiate the OLD class
                // AND start adding NEW functionality to a constructor
                console.log('Rendering template!');
                const element = document.getElementById(hookId);
                if (element) {
                    element.innerHTML = template;
                    element.querySelector('h1').textContent = this.name; // we can use 'this'
                }
            }
        };
    };
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
let Person = class Person {
    constructor() {
        this.name = 'Vasya';
        console.log('Creating a new Person!');
    }
};
Person = __decorate([
    Logger,
    LoggerFactory('LOGGING - PERSON'),
    WithTemplate('<h1>My Person Object</h1>', 'app')
], Person);
// instantiating does not affect the invocation of Decorators because they are called ONLY when we define a class
// BUT because WithTemplate decorator now returns a new class, and all the useful stuff is going on in this new class constructor
// we NEED to instantiate it:
const person = new Person();
// we can add Decorators to other places
// 1) To a property. In this case Decorator will implicitly(?) receive:
// - target
// - name
function PropertyLoggger(target, name) {
    console.log('Property Decorator!');
    console.log(target, name);
}
// 2) To an accessor. In this case Decorator will implicitly(?) receive:
// - target
// - name
// - propDescriptor
function AccessorLogger(target, name, propDescriptor) {
    console.log('Accessor Decorator!');
    console.log(target, name);
    console.log(propDescriptor);
}
// 3) To a method. In this case Decorator will implicitly(?) receive:
// - target
// - name
// - propDescriptor
function MethodLogger(target, name, propDescriptor) {
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
function MethodParameterLogger(target, name, position) {
    console.log('Method Parameter Decorator!');
    console.log(target, name);
    console.log(position);
}
class Product {
    constructor(t, p) {
        this.title = t;
        this._price = p;
    }
    // we can add Decorator to an accessor property AND it can RETURN a value which can be used by TS
    set price(value) {
        if (value > 0) {
            this._price = value;
        }
        else {
            throw new Error('Invalid price - should be a positive number');
        }
    }
    get price() {
        return this._price;
    }
    // we can add Decorator to a method property AND it can RETURN a value which can be used by TS
    getPriceWithTax(tax) {
        console.log(`Price with tax included: ${this._price * ((this._price / 100) * tax)}`);
    }
}
__decorate([
    PropertyLoggger
], Product.prototype, "title", void 0);
__decorate([
    AccessorLogger
], Product.prototype, "price", null);
__decorate([
    MethodLogger,
    __param(0, MethodParameterLogger)
], Product.prototype, "getPriceWithTax", null);
// to solve the problem with 'this' binding TS-way we can make another Decorator which we can later
// use with ANY class method to 100% bind 'this' to a class instance and not lose it later
function Autobind(target, methodName, propDescriptor) {
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
    constructor() {
        this.message = 'It works!';
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    Autobind
], Printer.prototype, "showMessage", null);
const printer = new Printer();
const button = document.querySelector('button');
// At first this won't work because 'this' will point to global object
// But AFTER using Autobind Decorator it works as expected!
button.addEventListener('click', printer.showMessage);
const registeredValidators = {};
// 'Required' and 'PositiveNumber' Decorators will register validators for props they are attached to (or called upon)
function Required(target, propName) {
    var _a, _b;
    // target.constructor.name - basically means that we get 'Course' in the end
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { 
        // we do this ugly logic to ensure that we don't lose any already registered validators for a specific prop
        [propName]: [...((_b = (_a = registeredValidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propName]) !== null && _b !== void 0 ? _b : []), 'required'] });
}
function PositiveNumber(target, propName) {
    var _a, _b;
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { 
        // we do this ugly logic to ensure that we don't lose any already registered validators for a specific prop
        [propName]: [...((_b = (_a = registeredValidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propName]) !== null && _b !== void 0 ? _b : []), 'positive'] });
}
// the validation logic will go here:
function validate(obj) {
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
            switch (validator) {
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
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const titleElement = document.getElementById('title');
    const priceElement = document.getElementById('price');
    const title = titleElement.value;
    const price = Number(priceElement.value);
    const createdCourse = new Course(title, price);
    if (!validate(createdCourse)) {
        alert('Invalid input! Please try again!');
        return;
    }
    console.log(createdCourse);
});
//# sourceMappingURL=app.js.map