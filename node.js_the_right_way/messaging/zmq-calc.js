/*
** zmq-calc.js
**
** Simple calculator that implements the "job" performed by workers.
*/

'use strict';


const operators = ['+','-','*','/'];
exports.operators = operators;

const calc = function (operand1, operand2, operator) {
  var result;

  switch (operator) {
    case '+': result = operand1 + operand2; break;
    case '-': result = operand1 - operand2; break;
    case '*': result = operand1 * operand2; break;
    case '/': result = operand1 / operand2; break;
    default:
      throw new Error("Unknown operator: " + operator);
  }
  
  return result;
};
exports.calc = calc;
