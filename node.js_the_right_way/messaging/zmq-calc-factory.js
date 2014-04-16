/*
 ** zmq-calc-factory.js
 **
 ** Factory methods that create the 0MQ push/pull queues.
 **
 ** Once the desired number of worker queues have been registered and have become
 ** ready, the ready event is fired.
 */

'use strict';

(function() {
  const zmq = require('zmq');

  const calcJobQueueName = 'ipc://calc-job.ipc';
  const calcResultQueueName = 'ipc://calc-result.ipc';


  const createPushJobQueue = function() {
    return zmq.socket('push').bind(calcJobQueueName);
  };
  exports.createPushJobQueue = createPushJobQueue;


  const createPullResultQueue = function() {
    return zmq.socket('pull').bind(calcResultQueueName);
  };
  exports.createPullResultQueue = createPullResultQueue;


  const createPullJobQueue = function() {
    return zmq.socket('pull').connect(calcJobQueueName);
  };
  exports.createPullJobQueue = createPullJobQueue;


  const createPushResultQueue = function() {
    return zmq.socket('push').connect(calcResultQueueName);
  };
  exports.createPushResultQueue = createPushResultQueue;


  const createJobResultMessage = function(type, pid, operand1, operand2, operator, result) {
    return JSON.stringify({
      type: type,
      pid: pid,
      operand1: operand1,
      operand2: operand2,
      operator: operator,
      result: result
    });
  };


  const createJobMessage = function(pid, operand1, operand2, operator) {
    return createJobResultMessage('job', pid, operand1, operand2, operator);
  };
  exports.createJobMessage = createJobMessage;


  const createResultMessage = function(pid, jobMsg, result) {
    return createJobResultMessage('result', pid, jobMsg.operand1, jobMsg.operand2, jobMsg.operator, result);
  };
  exports.createResultMessage = createResultMessage;


  const createReadyMessage = function(pid) {
    return JSON.stringify({
      type: 'ready',
      pid: pid
    });
  };
  exports.createReadyMessage = createReadyMessage;

}());
