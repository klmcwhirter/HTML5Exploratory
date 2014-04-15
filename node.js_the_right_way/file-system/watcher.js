const fs = require("fs");

const filename = process.argv[2];
if(!filename) {
    throw Error("A filename to watch must be specified.");
}

const log = function (msg) {
    var dt = new Date();
    console.log(dt.toLocaleString() + ': ' + msg);
};

fs.watch(filename, function () {
    log("File " + filename + " just changed.");
});
log("Now watching " + filename + " for changes...");
