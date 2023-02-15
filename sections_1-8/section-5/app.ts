type AddFn = (a: number, b: number) => number; // but this one is used more often than interface variant
// this is the same:
interface AddFnInterface {
    (a: number, b: number): number;
}

const add: AddFnInterface = (a, b) => {
    return 123;
}

interface Greetable {
    greet(phrase: string): void;
}
// this is the same as 'interface' when we are talking about objects description
// but we can't use 'type' for Class description
// and we can't use 'interface' for unions like we can with 'type' (e.g. type smth = smth1 | smth2)
type AnotherGreetable = {
    anotherGreet(phrase: string): void;
}

class Person implements Greetable {
    name: string;

    constructor(n: string) {
        this.name = n;
    }

    greet(phrase: string): void {
        console.log(phrase);
    }
}

const person: AnotherGreetable = {
    // hobby: 'Boxing', // 'hobby' does not exist in type 'AnotherGreetable'
    anotherGreet(phrase: string) {
        console.log(phrase);
    }
}
// this HACK is used to transform this file to a module which is done in this case to create a namespace
export {}