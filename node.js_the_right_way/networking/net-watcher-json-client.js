/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
 ***/
"use strict";

const net = require('net');

const port = process.env.PORT || 5432;
const client = net.connect({
    "port": port
});
client.on('data', function(data) {
    let message = JSON.parse(data);
    if (message.type === 'watching') {
        console.log("Now watching: " + message.file);
    }
    else if (message.type === 'changed') {
        let date = new Date(message.timestamp);
        console.log("File '" + message.file + "' changed at " + date);
    }
    else {
        throw new Error("Unrecognized message type: " + message.type);
    }
});
