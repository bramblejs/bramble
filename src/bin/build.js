const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));

module.exports = async ({ outDir = 'bramble', srcFiles = 'src/**/*.js' } = {}) => {
  const outDirRel = path.join(process.cwd(), outDir);
  await rimraf(outDir);
  await mkdirp(outDir);
}
