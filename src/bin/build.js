const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');

const webpack = promisify(require('webpack'));
const app = path.join.bind(path, __dirname, '..', '..', 'app');

module.exports = async args => {
  const out = path.join.bind(path, args.outDir);
  const tmp = path.join.bind(path, `${args.outDir}-tmp`);

  await fs.copy(app('index.js'), tmp('index.js'));
  await webpack({
    entry: './' + tmp('index.js'),
    output: {
      filename: out('bundle.js')
    }
  });
  await fs.copy(app('index.html'), out('index.html'));
  return await fs.remove(tmp());
};
