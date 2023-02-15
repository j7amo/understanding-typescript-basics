type Combinable = number | string;
type ConversionDescriptor = 'as-number' | 'as-text';
type SomeTypedObjAlias = {
    name: string;
    age: number;
}

let someTypedObj: SomeTypedObjAlias = {
    name: 'Vasya',
    age: 97,
    // hobbies: ['Hockey'] // Object literal may only specify known properties, and 'hobbies' does not exist in type 'SomeTypedObjAlias'.
}

function combine(
    n1: Combinable,
    n2: Combinable,
    resultConversion: ConversionDescriptor
) {
    // return n1 + n2; // This won't work because UNION is a standalone type and doesn't have '+' operator usage
    // in this case we have to explicitly define control flow for different scenarios
    let result;
    if (typeof n1 === 'number' && typeof n2 === 'number' || resultConversion === 'as-number') {
        result = Number(n1) + Number(n2); // this will cover 'number + number' case
    } else {
        result = n1.toString() + n2.toString(); // this will cover any other case
    }

    return result;
}

const combinedAges = combine(22, 33, 'as-number');
const combinedStringAges = combine('22', '33', 'as-number');
const combinedNames = combine('Vasya', 'Petya', 'as-text');

console.log(combinedAges);
console.log(combinedStringAges);
console.log(combinedNames);