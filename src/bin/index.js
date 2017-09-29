#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const config = require('../config');
const { getPackage } = require('../pkg');

const { argv } = yargs;
const cmd = argv._.join(path.delimiter) || 'check';

(async () => {
  const conf = await config();
  if (fs.existsSync(path.join(__dirname, `${cmd}.js`))) {
    await require(`./${cmd}`)({ ...conf, ...conf[cmd], ...argv });
  } else {
    throw new Error(`Command not found: ${cmd}`);
  }
})();
