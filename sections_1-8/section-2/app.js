"use strict";
// 1)
// in this case we don't get any errors from TS because "userInput" has "any" type which basically
// means that TS doesn't care for this variable at all (i.e. we basically turn TS off for this one)
// let userInput: any;
// let userName: string;
//
// userName = userInput; // no errors here
// 2)
// but if we use "unknown" type we don't turn TS off and have to check types before we do anything
let userInput;
let userName;
userInput = 'Roma';
// userName = userInput; // TS error!
// if we want to get rid of this error we explicitly show TS that we are checking and having the matching type
if (typeof userInput === 'string') {
    userName = userInput; // no error
}
// We use ANY when we don't care for the variable and we want to turn TS off.
// We use UNKNOWN when we don't know what the value of the variable will be but we have specific control flow (branching)
// for wanted types in case we get them.
// this is not necessary but a good practice to use NEVER type when function does not return anything at all
function generateError(message, code) {
    throw {
        message,
        code
    };
}
generateError('An error occurred', '500');
//# sourceMappingURL=app.js.map