/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
 ***/

"use strict";

const zmq = require('zmq');
const filename = process.argv[2];

// create request endpoint
const requester = zmq.socket('req');

// handle replies from responder
requester.on("message", function(data) {
  let response = JSON.parse(data);
  console.log("Received response:", response);
  process.exit(0);
});

const ip = process.env.IP || "localhost";
const port = process.env.PORT || "5433";
requester.connect('tcp://' + ip + ':' + port);

// send request for content
console.log('Sending request for ' + filename);
requester.send(JSON.stringify({
  path: filename
}));

process.on('exit', function(code) {
  console.log('Exiting with code ' + code);
  requester.close();
});
