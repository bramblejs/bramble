const fs = require('fs');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const { getCurrentVersion, getSchema, isPublished } = require('./pkg');
const size = require('./size');

module.exports = async ({ mains }) => {
  const schemaFilePath = './bramble-lock.json';
  const currentSchema = await getSchema();
  const version = (await isPublished())
    ? 'unreleased'
    : await getCurrentVersion();

  currentSchema[version] = {
    size: await size(mains)
  };

  await writeFile(schemaFilePath, JSON.stringify(currentSchema));
};
