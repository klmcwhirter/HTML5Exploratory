#
# zmq-calc.js
#
# Simple calculator that implements the "job" performed by workers.
#

exports.operators = ['+','-','*','/']

exports.calc = (operand1, operand2, operator) =>
  switch operator
    when '+' then result = operand1 + operand2
    when '-' then result = operand1 - operand2
    when '*' then result = operand1 * operand2
    when '/' then result = operand1 / operand2
    else throw new Error("Unknown operator: " + operator)

  result
