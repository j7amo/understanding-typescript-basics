"use strict";
// const person: {
//     name: string;
//     age: number;
//     hobbies: string[];
//     role: [number, string]; // <= TUPLE = Array of FIXED size and types (i.e. role.length - 2)
// } = {
//     name: 'Roman',
//     age: 38,
//     hobbies: ['Gaming', 'TV Shows'],
//     role: [2, 'author']
// };
Object.defineProperty(exports, "__esModule", { value: true });
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["AUTHOR"] = 1] = "AUTHOR";
    Role[Role["READ_ONLY"] = 2] = "READ_ONLY";
})(Role || (Role = {}));
// At first glance we could do something almost similar in Vanilla JS just with objects but Enum has ADVANTAGES over Objects:
// 1) Enum is not extendable(i.e. you can't just add new values to it) but Object is which is less strict.
// 2) Enum is strictly typed(i.e. you can't just assign Role.ADMIN = true because it has inferred type of number) but in Object you can.
// 3) When you say that a variable is of type of previously declared Enum than it means that this variable can have ONLY the values
// of this particular Enum
const person = {
    name: 'Roman',
    age: 38,
    hobbies: ['Gaming', 'TV Shows'],
    role: Role.AUTHOR
};
let favoriteActivities;
favoriteActivities = ['Sports'];
// person.role[0] = 'Vasya'; // Type 'string' is not assignable to type 'number'.
// person.role.push(2); // the only EXCEPTION which works and Typescript can't do anything about it
// person.role = [1, 'Vasya', 33]; //Type '[number, string, number]' is not assignable to type '[number, string]'. Source has 3 element(s) but target allows only 2.
console.log(person);
//# sourceMappingURL=obj-arrays-enums.js.map