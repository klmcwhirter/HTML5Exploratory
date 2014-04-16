/*
** zmq-calc-worker.js
**
** This is the worker for the zmq-calc-server.js app.
**
** It is setup in the zmq-calc-cluster module. It does the following.
** - setup queues
** - send 'ready' message to Result queue
** - listens for 'job' messages
** - when 'job' message is received use zmq-calc module to perform work
** - send result back by sending a 'result' message in Result queue
**
*/
'use strict';

const calc = require('./zmq-calc');
const util = require("util");
const factory = require('./zmq-calc-factory');

const DEBUG = process.env.DEBUG || false;

function log(msg) {
  util.log(process.pid + " [Worker]: " + msg);
}

const performJob = function(msg) {
  const operand1 = msg.operand1;
  const operand2 = msg.operand2;
  const operator = msg.operator;
  
  const result = calc.calc(operand1, operand2, operator);
  return result;
};

const sendErrorMessage = function(msg) {
  const data = factory.createErrorMessage(process.pid, msg);
  resultQ.send(data);
};

const sendResultMessage = function(msg, result) {
  const data = factory.createResultMessage(process.pid, msg, result);
  resultQ.send(data);
};

const showJobMessage = function(msg) {
  var s = process.pid + ': Received job from pid ' + msg.pid;
  if(DEBUG) {
    s += '\n';
    s += util.inspect(msg);
  }
  log(s);
};

const receiveJobMessage = function (data) {
  var msg = JSON.parse(data);
  if(DEBUG) {
    log('received: '+ util.inspect(msg));
  }
  switch(msg.type) {
    case 'job':
      showJobMessage(msg);
      var result = performJob(msg);
      sendResultMessage(msg, result);
      break;
    default:
      sendErrorMessage(msg);
      break;
  }
};

log('connecting to job queue...');

const jobQ = factory.createPullJobQueue();

log('listening for job messages...');
jobQ.on('message', receiveJobMessage);

log('connecting to result queue...');
const resultQ = factory.createPushResultQueue();

const readyMsg = factory.createReadyMessage(process.pid);
log('sending ready message' + readyMsg);
resultQ.send(readyMsg);
