/*
** zmq-calc-cluster.js
**
** Manage the cluster for zmq-calc-server.js
**
** Once the desired number of worker queues have been registered and have become
** ready, the jobs are sent.
*/

'use strict';


const cluster = require('cluster');
const util = require("util");

const calc = require('./zmq-calc');
const factory = require('./zmq-calc-factory');

const DEBUG = process.env.DEBUG || false;

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function log(msg) {
  util.log(process.pid + " [Master]: " + msg);
}

const ZmqCalcCluster = function (numWorkers, numJobs) {
  const that = this;

  that.readyWorkers = 0;
  that.numResults = 0;

  var jobQ, resultQ;
  
  const exitIfDone = function() {
    if(that.numResults >= numJobs) {
      log('all jobs completed. Exiting.');
      process.exit(0);
    }
  };

  const sendJobMessage = function () {
    const operand1 = getRandomInteger(1,100);
    const operand2 = getRandomInteger(1,100);
    const operatorIdx = getRandomInteger(0, calc.operators.length - 1);
    const operator = calc.operators[operatorIdx];

    jobQ.send(factory.createJobMessage(process.pid, operand1, operand2, operator));
  };

  const sendJobMessagesIfReady = function () {
    that.readyWorkers += 1;
    log(that.readyWorkers + ' ready workers...');
    if(numWorkers <= that.readyWorkers) {
      log('sending job messages');
      for(var i = 1; i <= numJobs; i++) {
        sendJobMessage();
      }
    }
  };

  const showReadyMessage = function (msg) {
    log("Worker with pid " + msg.pid + " has become ready");
  };

  const showResultMessage = function (msg) {
    that.numResults += 1;
    var s = "Received Result message from pid " + msg.pid + ": ";
    s += msg.operand1 + " " + msg.operator + " " + msg.operand2 + " = " + msg.result;
    s += "\n";
    s += "have received " + that.numResults + " results.";
    log(s);
  };

  const showUnknownMessage = function (msg) {
    log('Received unknown Result message:');
    log(msg);
  };

  const receiveErrorMessage = function(data) {
    try {
      const msg = JSON.parse(data);
      log('Error message: ' + util.inspect(msg));
    } catch(e) {
      log('Parsing error: ' + e + "\n" + data);
    }
  };

  const receiveResultMessage = function(data) {
    try {
      const msg = JSON.parse(data);
      switch(msg.type) {
        case 'ready' : showReadyMessage(msg); sendJobMessagesIfReady(); break;
        case 'result': showResultMessage(msg); exitIfDone(); break;
        default      : showUnknownMessage(msg); break;
      }
    } catch(e) {
      log('Parsing error: ' + e + "\n" + data);
    }
  };

  const forkWorker = function() {
    var worker = cluster.fork();
    worker.on('exit', function(code, signal) {
      forkWorker();
    });
    return worker;
  };

  const forkWorkers = function () {
  
    cluster.setupMaster({
      exec: './zmq-calc-worker.js',
      args: [],
      silent: false
    });

    for(var i = 1; i <= numWorkers; i++) {
      log('forking worker ' + i);
      forkWorker();
    }
  };
  
  ZmqCalcCluster.prototype.run = function () {
    log('Creating job queue');
    jobQ = factory.createPushJobQueue();
    log('Creating result queue');
    resultQ = factory.createPullResultQueue();
    log('Subscribing to message on result queue');
    resultQ.on('message', receiveResultMessage);
    log('Subscribing to error on result queue');
    resultQ.on('error', receiveErrorMessage);
    log('Forking workers');
    forkWorkers();
  };
};

exports.ZmqCalcCluster = ZmqCalcCluster;

exports.initialize = function (numWorkers, numJobs) {
  return new ZmqCalcCluster(numWorkers, numJobs);
};
