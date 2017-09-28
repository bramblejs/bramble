const fs = require('fs');
const { promisify } = require('util');

const glob = promisify(require('glob'));
const stat = promisify(fs.stat);

module.exports = async srcFiles =>
  await (await glob(srcFiles)).reduce(
    async (prev, curr) => (await prev) + (await stat(curr)).size,
    Promise.resolve(0)
  );
