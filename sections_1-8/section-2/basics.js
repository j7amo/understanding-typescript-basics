"use strict";
function addNumbers2(n1, n2, printResult, phrase) {
    if (printResult) {
        console.log(`${phrase}${n1 + n2}`);
    }
    return n1 + n2;
}
const number1 = 5;
const number2 = 2.8;
const showResult = true;
const resultPhrase = 'Result is: ';
addNumbers2(number1, number2, showResult, resultPhrase);
//# sourceMappingURL=basics.js.map