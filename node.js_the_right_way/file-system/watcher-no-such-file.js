"use strict";

const fs = require("fs");
const util = require("util");

const log = function (msg) {
    var dt = new Date();
    console.log(dt.toLocaleString() + ': ' + msg);
};


const filename = process.argv[2];
if(!filename) {
    throw new Error("A filename to watch must be specified.");
}

var haveBeenWatching = false;
const watcher = fs.watchFile(filename, function (curr, prev) {
    log("current: " + util.inspect(curr));
    log("isFile: " + curr.isFile());
    log("previous: " + util.inspect(prev));
    log("isFile: " + prev.isFile());
    
    if(haveBeenWatching && !curr.isFile()) {
        fs.unwatchFile(filename);
    } else {
        haveBeenWatching = true;
    }
});
util.inspect(watcher);

log("Now watching " + filename + " for changes...");
