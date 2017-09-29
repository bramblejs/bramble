const fs = require('fs');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

const config = require('./config');
const { getCurrentVersion, getSchema, isPublished } = require('./pkg');
const size = require('./size');

module.exports = async args => {
  const { mains } = { ...(await config()), ...args };
  const currentSchema = await getSchema();
  const version = (await isPublished())
    ? 'unreleased'
    : await getCurrentVersion();

  currentSchema[version] = {
    size: await size(mains)
  };

  return currentSchema;
};
