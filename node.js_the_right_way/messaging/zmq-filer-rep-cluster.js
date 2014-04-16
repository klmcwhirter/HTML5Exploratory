/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
 ***/

'use strict';

const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zmq');

if (cluster.isMaster) {
  const forkWorker = function() {
    var worker = cluster.fork();
    worker.on('exit', function(code, signal) {
      forkWorker();
    });
  };

  const ip = process.env.IP || "localhost";
  const port = process.env.PORT || "5433";

  // master process - create ROUTER and DEALER sockets, bind endpoints
  let router = zmq.socket('router').bind('tcp://' + ip + ':' + port);
  let dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  // forward messages between router and dealer
  router.on('message', function() {
    let frames = Array.prototype.slice.call(arguments);
    dealer.send(frames);
  });

  dealer.on('message', function() {
    let frames = Array.prototype.slice.call(arguments);
    router.send(frames);
  });

  // listen for workers to come online
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

  // fork three worker processes
  for (let i = 0; i < 3; i++) {
    forkWorker();
  }

}
else {

  // worker process - create REP socket, connect to DEALER
  let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

  responder.on('message', function(data) {

    // parse incoming message
    let request = JSON.parse(data);
    console.log(process.pid + ' received request for: ' + request.path);

    // read file and reply with content
    fs.readFile(request.path, function(err, data) {
      console.log(process.pid + ' sending response');
      responder.send(JSON.stringify({
        pid: process.pid,
        data: data.toString(),
        timestamp: Date.now()
      }));
    });

  });

}
