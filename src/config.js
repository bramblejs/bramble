const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

const { getPackage } = require('./pkg');

function cwd(...args) {
  return path.join(process.cwd(), ...args);
}

function load(...args) {
  return require(cwd(...args));
}

module.exports = async () => {
  const defaults = {
    limit: 0,
    mains: (await getPackage()).main || 'src/**/*.js',
    threshold: 0
  };
  return {
    ...defaults,
    ...((await getPackage()).bramble ||
      ((await exists('bramble.json')) && load('bramble.json')) ||
      {})
  };
};
