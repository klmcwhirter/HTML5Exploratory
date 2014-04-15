#!/usr/bin/env node --harmony

// note the env shebang does not work on cloud9

require('fs').createReadStream(process.argv[2]).pipe(process.stdout);
