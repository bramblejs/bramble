const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const glob = promisify(require('glob'));
const mkdirp = promisify(require('mkdirp'));
const readFile = promisify(fs.readFile);
const rimraf = promisify(require('rimraf'));
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

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

  const date = new Date().toGMTString();
  const size = await (await glob(srcFiles)).reduce(
    async (prev, curr) => (await prev) + (await stat(curr)).size,
    Promise.resolve(0)
  );

  existingSchema.data = existingSchema.data.concat({
    date,
    size
  });

  writeFile(schemaFilePath, JSON.stringify(existingSchema));
};
