const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');

const webpack = promisify(require('webpack'));

module.exports = async args => {
  const copy = async file =>
    await fs.copy(
      path.join(__dirname, '..', '..', 'app', file),
      path.join(args.outDir, file)
    );
  await copy('index.html');
  await copy('index.js');
  await webpack({
    entry: `${args.outDir}/index.js`,
    output: {
      filename: `${args.outDir}/bundle.js`
    }
  });
  return await fs.unlink(`${args.outDir}/index.js`);
};
