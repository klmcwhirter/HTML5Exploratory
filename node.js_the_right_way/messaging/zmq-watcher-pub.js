/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
***/

'use strict';
const
  fs = require('fs'),
  util = require("util"),
  zmq = require('zmq'),
  
  // create publisher endpoint
  publisher = zmq.socket('pub'),
  
  filename = process.argv[2];

fs.watch(filename, function(){
    let msg = {
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  };
  
  console.log("Sending: " + util.inspect(msg));

  // send message to any subscribers
  publisher.send(JSON.stringify(msg));
  
});

// listen on TCP port 5432
const ip = process.env.IP || "*";
const port = process.env.PORT || "5432";
const bindport = 'tcp://' + ip + ':' + port;
publisher.bind(bindport, function(err) {
  console.log('Listening for zmq subscribers...');
});

