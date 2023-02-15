"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const names = ['Petya', 'Vasya']; //  TS infers that 'names' type is string[]
// these are the SAME (just 2 different approaches):
const stringNamesArray = [];
const stringNamesArrayUsingGenerics = []; // Array knows which type of data it stores
// by specifying promise type as Promise<string> we let TS know that promise will eventually resolve to a string
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('This is resolved!');
    }, 1000);
});
// which gives TS more control over types and helps us reduce the number of mistakes we make!
// in this particular case TS already knows that 'data' is of type 'string'
promise.then((data) => {
    // console.log(data * 2); // and TS helps us spot the mistake - this won't work!
    console.log(data.replace(/i/g, 'I')); // this will work as TS knows that this is a string!
});
// GENERIC FUNCTIONS
// this is ok but...
function merge(objA, objB) {
    return Object.assign(objA, objB);
}
console.log(merge({ name: 'Vasya' }, { age: 99 })); // works fine but...
const mergedObj = merge({ name: 'Vasya' }, { age: 99 });
// mergedObj.name // won't work as it is just an object whose prototype is Object.prototype and which doesn't have 'name' prop
console.log(Object.getPrototypeOf(mergedObj) === Object.prototype); // true
// the GENERIC version of the previous function is much more flexible and TS now can infer types out of it
function genericMerge(objA, objB) {
    return Object.assign(objA, objB); // in this case the return value is typed like this: T & U which is an intersection
}
const genericMergedObj = genericMerge({ name: 'Vasya' }, { age: 99 }); // returns {name: string} & {age: number}
// const genericMergedObj1 = genericMerge({ name: 'Vasya' }, 33);// this won't work as type <U> has a constraint of being an object
// so now we can access these props:
console.log(genericMergedObj.age);
console.log(genericMergedObj.name);
function countAndDescribe(element) {
    let description = 'Got no value';
    if (element.length === 1) {
        description = 'Got ' + element.length + ' element';
    }
    else if (element.length > 1) {
        description = 'Got ' + element.length + ' elements';
    }
    return [element, description];
}
console.log(countAndDescribe([1, 2, 3])); // works ok as arrays have length prop
console.log(countAndDescribe('Hello world!')); // works ok as strings have length prop
// console.log(countAndDescribe(123)); // won't work as numbers don't have length prop
// KEYOF constraint lets us specify a type which is a property of some other object
function extractAndConvert(obj, key) {
    return obj[key];
}
// extractAndConvert({}, 'name'); // this won't work because {} doesn't have a 'name' property
extractAndConvert({ name: 'Vasya' }, 'name'); // this works OK because { name: 'Vasya' } has a 'name' property!
// CLasses with Generics
class DataStorage {
    constructor() {
        this.data = [];
    }
    addItem(item) {
        this.data.push(item);
    }
    removeItem(item) {
        this.data.splice(this.data.indexOf(item), 1);
    }
    getItems() {
        return [...this.data];
    }
}
// now when we have Generic class we can create different versions of its instances
const textStorage = new DataStorage(); // this one will work with strings
// textStorage.addItem(123); // won't work
textStorage.addItem('Vasya'); // works ok
textStorage.removeItem('Vasya');
const numbersStorage = new DataStorage(); // this one will work with numbers
// numbersStorage.addItem('Vasya'); // won't work
numbersStorage.addItem(123); // works ok
numbersStorage.removeItem(123);
function createCourseGoal(title, description, completeUntil) {
    // 'Partial<CourseGoal>' means that all 3 of 'CourseGoal' props will become optional
    // which lets us assign even an empty object as an initial value!
    let courseGoal = {};
    // and even more: we can initialize properties one at a time step by step (which won't work if we don't use 'Partial')
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = completeUntil;
    // in the end we also have to do some Type casting as we know that courseGoal is definitely not a Partial anymore
    return courseGoal;
}
// 2) READONLY
// if we want to make some reference type object 'readonly' we can use a corresponding built-in generic type
const nameZz = ['Vasya', 'Petya'];
//# sourceMappingURL=app.js.map