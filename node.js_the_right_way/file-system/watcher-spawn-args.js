"use strict";

const fs = require("fs");
const spawn = require('child_process').spawn;

const log = function (msg) {
    var dt = new Date();
    console.log(dt.toLocaleString() + ': ' + msg);
};


log(process.argv);

const filename = process.argv[2];
if(!filename) {
    throw new Error("A filename to watch must be specified.");
}

const cmd = process.argv[3];
log(cmd);

var args = process.argv.slice(4);
log(args);
args = args.concat([ filename ]);
log(args);

fs.watch(filename, function () {
    log("File " + filename + " just changed.");
    let ls = spawn(cmd, args);
    ls.stdout.pipe(process.stdout);
});
log("Now watching " + filename + " for changes...");
