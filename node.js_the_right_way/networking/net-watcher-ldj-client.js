/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
***/

"use strict";

const
  net = require('net'),
  ldj = require('./ldj.js'),
  
  port = process.env.PORT || 5432,
  netClient = net.connect({ "port": port }),
  ldjClient = ldj.connect(netClient);

ldjClient.on('message', function(message) {
  if (message.type === 'watching') {
    console.log("Now watching: " + message.file);
  } else if (message.type === 'changed') {
    console.log(
      "File '" + message.file + "' changed at " + new Date(message.timestamp)
    );
  } else {
    throw new Error("Unrecognized message type: " + message.type);
  }
});

ldjClient.on('error', function(err) {
    console.log(err + "\n");
});
