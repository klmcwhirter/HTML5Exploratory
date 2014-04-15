'use strict';

const fs = require("fs");
const net = require("net");

const log = function (msg) {
    console.log((new Date()).toLocaleString() + ': ' + msg);
};


const filename = process.argv[2];
const server = net.createServer(function (connection) {
    // reporting
    log("Subscriber connected.");
    connection.write("Now watching " + filename + " for changes ..." + "\n");
    // watcher setup
    let watcher = fs.watch(filename, function () {
        connection.write("File '" + filename + "' changed: " + (new Date()).toLocaleString() + "\n");
    });
    connection.on('close', function () {
        log('Subscriber disconnected.');
        watcher.close();
    });
});

if(!filename) {
    throw new Error("No target filename was specified.");
}

const port = '/tmp/watcher.sock';
server.listen(port, function () {
    log("Listening for subscribers on port " + port + " ...");
});
