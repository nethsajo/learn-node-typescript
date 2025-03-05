// console.log(arguments);
// console.log(require('module').wrapper);

import Calculator from 'test-module-1';
const firstCalculation = new Calculator();
console.log(firstCalculation.add(2, 5));

const { add, multiply, divide } = require('./test-module-2');
console.log(multiply(5, 5));
