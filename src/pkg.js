const fs = require('fs');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

const pkgFilePath = 'package.json';

module.exports = async () =>
  (await exists(pkgFilePath))
    ? await JSON.parse(await readFile(pkgFilePath))
    : {};
