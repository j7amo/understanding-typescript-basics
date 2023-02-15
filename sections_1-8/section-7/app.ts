const names = ['Petya', 'Vasya'] //  TS infers that 'names' type is string[]
// these are the SAME (just 2 different approaches):
const stringNamesArray: string[] = [];
const stringNamesArrayUsingGenerics: Array<string> = []; // Array knows which type of data it stores

// by specifying promise type as Promise<string> we let TS know that promise will eventually resolve to a string
const promise: Promise<string> = new Promise((resolve, reject) => {
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
function merge(objA: object, objB: object): object {
    return Object.assign(objA, objB);
}

console.log(merge({ name: 'Vasya' }, { age: 99 })); // works fine but...
const mergedObj = merge({ name: 'Vasya' }, { age: 99 });
// mergedObj.name // won't work as it is just an object whose prototype is Object.prototype and which doesn't have 'name' prop
console.log(Object.getPrototypeOf(mergedObj) === Object.prototype); // true

// the GENERIC version of the previous function is much more flexible and TS now can infer types out of it
function genericMerge<T extends object, U extends object>(objA: T, objB: U) { // 'extends object' part is a constraint
    return Object.assign(objA, objB); // in this case the return value is typed like this: T & U which is an intersection
}

const genericMergedObj = genericMerge({ name: 'Vasya' }, { age: 99 });// returns {name: string} & {age: number}
// const genericMergedObj1 = genericMerge({ name: 'Vasya' }, 33);// this won't work as type <U> has a constraint of being an object

// so now we can access these props:
console.log(genericMergedObj.age);
console.log(genericMergedObj.name);

// generic with constraint with a custom interface:
interface Lengthy {
    length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
    let description = 'Got no value';
    if (element.length === 1) {
        description = 'Got ' + element.length + ' element';
    } else if (element.length > 1) {
        description = 'Got ' + element.length + ' elements';
    }

    return [element, description];
}

console.log(countAndDescribe([1, 2, 3])); // works ok as arrays have length prop
console.log(countAndDescribe('Hello world!')); // works ok as strings have length prop
// console.log(countAndDescribe(123)); // won't work as numbers don't have length prop

// KEYOF constraint lets us specify a type which is a property of some other object
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
    return obj[key];
}

// extractAndConvert({}, 'name'); // this won't work because {} doesn't have a 'name' property
extractAndConvert({ name: 'Vasya' }, 'name'); // this works OK because { name: 'Vasya' } has a 'name' property!

// CLasses with Generics
class DataStorage<T extends string | number | boolean> { // (1) we add primitive constraints to make this class work only with primitives
    private data: T[] = [];

    addItem(item: T) {
        this.data.push(item);
    }

    removeItem(item: T) {
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems() {
        return [...this.data];
    }
}

// now when we have Generic class we can create different versions of its instances
const textStorage = new DataStorage<string>(); // this one will work with strings
// textStorage.addItem(123); // won't work
textStorage.addItem('Vasya'); // works ok
textStorage.removeItem('Vasya');

const numbersStorage = new DataStorage<number>(); // this one will work with numbers
// numbersStorage.addItem('Vasya'); // won't work
numbersStorage.addItem(123); // works ok
numbersStorage.removeItem(123);

// const objStorage = new DataStorage<object>(); // this won't work anymore because class now only works with primitives
// objStorage.addItem({ name: 'Vasya' });
// objStorage.addItem({ name: 'Petya' });
// objStorage.addItem({ name: 'Jenya' });
// console.log(objStorage.getItems());
// objStorage.removeItem({ name: 'Petya' }); // this won't work correctly because we create objects on the fly and references don't match
// console.log(objStorage.getItems());
// so the results of using DataStorage for storing objects are inconsistent,
// and it's better to change current class implementation (see (1))

// BUILT-IN GENERIC UTILITY TYPES
// 1) PARTIAL
interface CourseGoal {
    title: string;
    description: string;
    completeUntil: Date;
}

function createCourseGoal(
    title: string,
    description: string,
    completeUntil: Date,
): CourseGoal {
    // 'Partial<CourseGoal>' means that all 3 of 'CourseGoal' props will become optional
    // which lets us assign even an empty object as an initial value!
    let courseGoal: Partial<CourseGoal> = {};
    // and even more: we can initialize properties one at a time step by step (which won't work if we don't use 'Partial')
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = completeUntil;

    // in the end we also have to do some Type casting as we know that courseGoal is definitely not a Partial anymore
    return courseGoal as CourseGoal;
}

// 2) READONLY
// if we want to make some reference type object 'readonly' we can use a corresponding built-in generic type
const nameZz: Readonly<string[]> = ['Vasya', 'Petya'];
// nameZz.push('Jenya'); // so we can't mutate 'nameZz' anymore

export {}