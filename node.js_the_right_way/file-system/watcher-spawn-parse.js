"use strict";

const fs = require("fs");
const spawn = require('child_process').spawn;
const util = require("util");

const log = function (msg) {
    var dt = new Date();
    console.log(dt.toLocaleString() + ': ' + msg);
};


const filename = process.argv[2];
if(!filename) {
    throw new Error("A filename to watch must be specified.");
}

const fsWatcher = fs.watch(filename, function () {
    log("File " + filename + " just changed.");
    let ls = spawn('ls', ['-lh', filename]);
    let output = '';
    ls.stdout.on('data', function (chunk) {
        output += chunk.toString();
    });
    ls.stdout.on('close', function () {
        let parts = output.split(/\s+/);
        console.dir([parts[0], parts[4], parts[8]]);
    });
});
fsWatcher.on('error', function (err) {
    log("ERROR: " + err);
    fsWatcher.close();
});

log("Now watching " + filename + " for changes...");
