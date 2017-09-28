const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const mkdirp = promisify(require('mkdirp'));
const readFile = promisify(fs.readFile);
const rimraf = promisify(require('rimraf'));
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

const date = require('../date');
const pkg = require('../pkg');
const size = require('../size');

const defaults = {
  outDir: 'bramble',
  srcFiles: 'src/**/*.js'
};

module.exports = async args => {
  const { outDir, srcFiles } = { ...defaults, ...args };
  const schemaFilePath = path.join(outDir, 'schema.json');
  const existingSchema = (await exists(schemaFilePath))
    ? JSON.parse(await readFile(schemaFilePath))
    : { data: [] };

  await rimraf(outDir);
  await mkdirp(outDir);

  existingSchema.data = existingSchema.data.concat({
    date: date(),
    size: await size(srcFiles),
    version: (await pkg()).version || ''
  });

  writeFile(schemaFilePath, JSON.stringify(existingSchema));
};
