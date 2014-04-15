"use strict";

const fs = require("fs");
const spawn = require('child_process').spawn;

const filename = process.argv[2];
if(!filename) {
    throw new Error("A filename to watch must be specified.");
}

const log = function (msg) {
    var dt = new Date();
    console.log(dt.toLocaleString() + ': ' + msg);
};

fs.watch(filename, function () {
    log("File " + filename + " just changed.");
    let ls = spawn('ls', ['-lh', filename]);
    ls.stdout.pipe(process.stdout);
});
log("Now watching " + filename + " for changes...");
