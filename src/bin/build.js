const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');

const webpack = promisify(require('webpack'));

module.exports = async args => {
  await fs.copy(
    path.join(__dirname, '..', '..', 'app', 'index.html'),
    path.join(args.outDir, 'index.html')
  );
  await fs.copy(
    path.join(__dirname, '..', '..', 'app', 'index.js'),
    path.join(args.outDir, 'index.js')
  );
  await webpack({
    entry: `${args.outDir}/index.js`,
    output: {
      filename: `${args.outDir}/bundle.js`
    }
  });
  return await fs.unlink(`${args.outDir}/index.js`);
};
