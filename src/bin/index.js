#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const { getPackage } = require('../pkg');

const { argv } = yargs;
const cmd = argv._.join(path.delimiter) || 'check';

(async () => {
  if (fs.existsSync(path.join(__dirname, `${cmd}.js`))) {
    await require(`./${cmd}`)(argv);
  } else {
    throw new Error(`Command not found: ${cmd}`);
  }
})();
