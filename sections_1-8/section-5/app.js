"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add = (a, b) => {
    return 123;
};
class Person {
    constructor(n) {
        this.name = n;
    }
    greet(phrase) {
        console.log(phrase);
    }
}
const person = {
    // hobby: 'Boxing', // 'hobby' does not exist in type 'AnotherGreetable'
    anotherGreet(phrase) {
        console.log(phrase);
    }
};
//# sourceMappingURL=app.js.map