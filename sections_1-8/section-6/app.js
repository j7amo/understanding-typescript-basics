"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const e1 = {
    name: 'Vasya',
    startDate: new Date(),
    privileges: ['Hacking'],
};
function printEmployeeInfo(employee) {
    console.log(employee.name);
    // we CANNOT do this:
    // if (typeof employee === 'Admin') {} // because this will work in the runtime an JS doesn't know anything about custom types
    // we also CANNOT do this:
    // if (employee.privileges) {} // because TS will not let us do it
    if ('privileges' in employee) { // this WORKAROUND is a TYPE GUARD
        console.log(employee.privileges);
    }
    if ('startDate' in employee) { // this WORKAROUND is a TYPE GUARD
        console.log(employee.startDate);
    }
}
const unknownEmployee = {
    name: 'Petya',
    startDate: new Date(),
};
printEmployeeInfo(unknownEmployee);
const smth = 123; // this works OK!
function add(a, b) {
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
};
console.log((_a = fetchedUserInfo === null || fetchedUserInfo === void 0 ? void 0 : fetchedUserInfo.job) === null || _a === void 0 ? void 0 : _a.title);
class Car {
    drive() {
        console.log('Driving a car...');
    }
}
class Truck {
    drive() {
        console.log('Driving a truck...');
    }
    loadCargo(amount) {
        console.log('Loading cargo ' + amount);
    }
}
const v1 = new Car();
const v2 = new Truck();
function useVehicle(vehicle) {
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
function moveAnimal(animal) {
    // of course, we can do it using 'IN' operator as it is a case of typed objects
    if ('flyingSpeed' in animal) {
        console.log('Moving with speed of... ' + animal.flyingSpeed);
    }
    else if ('runningSpeed' in animal) {
        console.log('Moving with speed of... ' + animal.runningSpeed);
    }
    // but we can also do it with the help of DISCRIMINATED UNIONS
    // when we have several types/interfaces with one common property (see (1)) to check for
    let speed;
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
const animal = {
    type: 'bird',
    flyingSpeed: 100,
};
moveAnimal(animal);
// TYPECASTING
// const paragraph = document.querySelector('p'); // TS sees 'p' and knows that it is a HTMLParagraphElement
// const possiblyParagraph = document.getElementById('#message-output'); // TS doesn't know if it is a HTMLParagraphElement anymore!
// to tell TS what type we are using explicitly we can use 2 different syntax's of Type Casting
// 1) This approach works fine INSIDE React code
const paragraphForSure = document.getElementById('#message-output'); // now TS knows 100%!
// 2) This approach is not good for React as <> angle brackets are used for JSX
const userInputElement = document.getElementById('#user-input');
userInputElement.value = 'Hi!';
const errorBag1 = {}; // this will work! We don't have to add any props at all if we want to!
const errorBag2 = {
    email: 'Not a valid EMAIL!',
    // code: 123, // this won't work! We can have as many props as we want, but they should comply with INDEX TYPE
    userName: 'Must start with a capital letter!'
};
//# sourceMappingURL=app.js.map