const fs = require('fs');
const sourceTrace = require('source-trace');
const { promisify } = require('util');

const glob = promisify(require('glob'));
const stat = promisify(fs.stat);

module.exports = async mains => {
  if (typeof mains === 'string') {
    mains = [mains];
  }

  const uniqueFiles = mains
    .reduce((prev, curr) => {
      return prev.concat(sourceTrace(curr));
    }, [])
    .filter((val, idx, arr) => {
      return arr.indexOf(val) === idx;
    });

  return await uniqueFiles.reduce(async (total, file) => {
    return (await total) + (await stat(file)).size;
  }, Promise.resolve(0));
};
