const fs = require('fs');
const { promisify } = require('util');

const schema = require('../schema');

const writeFile = promisify(fs.writeFile);

const schemaFilePath = 'bramble-lock.json';

module.exports = async () => {
  return await writeFile(schemaFilePath, JSON.stringify(await schema()));
};
