"use strict";
function addNumbers(n1, n2) {
    return n1 + n2;
}
function printResult(num) {
    console.log(num);
}
// the same as:
function printResult1(num) {
    console.log(num);
    return;
}
printResult(addNumbers(1, 2));
// 1)
// let combineValues; // this has ANY type
// combineValues = 5; // so technically we can assign anything and Typescript won't tell us anything
// 2)
// let combineValues: Function; // we can use one of Typescript types
// combineValues = 5; // this helps us get a type check error here (which is good!)
// 3)
// it's much better but it will be an abstract function which means that we can assign ANY function to this variable
// let combineValues: Function;
// combineValues = printResult;
// 4)
// if we want a variable to be a very specific function with specific signature and return type we can do this:
let combineValues;
combineValues = addNumbers; // in this case everything is OK because "addNumbers"'s signature matches type of "combineValues"
// combineValues = printResult; // here we have a type check error as signatures don't match
console.log(combineValues(2, 3)); // we clearly ONLY want a function here
// the same approach works for callbacks:
function addAndHandle(n1, n2, cb) {
    const sum = n1 + n2;
    cb(sum);
}
addAndHandle(1, 2, (num) => {
    console.log(num);
    return 'Vasya'; // this one is tricky: in the type description of "cb" we've used "void" as a return type
    // but if we explicitly return something (like a string in this case) Typescript won't control it (which is not cool)
    // SO it's better to not return anything if we use "void" OR return a specific type which matches a specific type in the description
    // (e.g. (num: number) => number; =====> return 123;
});
//# sourceMappingURL=functions.js.map