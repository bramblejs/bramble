#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const { getPackage } = require('../pkg');

const { argv } = yargs;
const cmd = argv._.join(path.delimiter) || 'default';

(async () => {
  const main = (await getPackage()).main;
  const defaults = {
    limit: 0,
    mains: main || 'src/**/*.js',
    threshold: 1024
  };

  if (fs.existsSync(path.join(__dirname, `${cmd}.js`))) {
    require(`./${cmd}`)({ ...defaults, ...argv });
  } else {
    throw new Error(`Command not found: ${cmd}`);
  }
})();
