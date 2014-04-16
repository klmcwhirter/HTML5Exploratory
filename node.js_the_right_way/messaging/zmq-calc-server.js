/*
** Simple server that drives the zmq-calc application.
*/

'use strict';

const cluster = require("cluster");
const zmqCalcCluster = require('./zmq-calc-cluster');

const numWorkers = process.argv[2] || 3;
const numJobs    = process.argv[3] || 30;

if(cluster.isMaster) {
  const calcCluster = zmqCalcCluster.initialize(numWorkers, numJobs);
  
  console.log('Master pid: ' + process.pid);
  
  calcCluster.run();
}
