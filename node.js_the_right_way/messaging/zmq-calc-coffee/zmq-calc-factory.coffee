#
# zmq-calc-factory.js
#
# Factory methods that create the 0MQ push/pull queues.
#
# Once the desired number of worker queues have been registered and have become
# ready, the ready event is fired.
#

zmq = require('zmq');

calcJobQueueName = 'ipc://calc-job.ipc'
calcResultQueueName = 'ipc://calc-result.ipc'

# Master queues
exports.createPushJobQueue = () -> zmq.socket('push').bind(calcJobQueueName)
exports.createPullResultQueue = () -> zmq.socket('pull').bind(calcResultQueueName)

# Worker queues
exports.createPullJobQueue = () -> zmq.socket('pull').connect(calcJobQueueName);
exports.createPushResultQueue = () -> zmq.socket('push').connect(calcResultQueueName)


createJobResultMessage = (type, pid, operand1, operand2, operator, result) ->
  JSON.stringify(
    type: type,
    pid: pid,
    operand1: operand1,
    operand2: operand2,
    operator: operator,
    result: result
  )

exports.createJobMessage = (pid, operand1, operand2, operator) ->
  createJobResultMessage('job', pid, operand1, operand2, operator)

exports.createResultMessage = (pid, jobMsg, result) ->
  createJobResultMessage('result', pid, jobMsg.operand1, jobMsg.operand2, jobMsg.operator, result)


exports.createReadyMessage = (pid) ->
  JSON.stringify(
    type: 'ready',
    pid: pid
  )
