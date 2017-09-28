const bytes = require('bytes');
const chalk = require('chalk');
const fs = require('fs');
const outdent = require('outdent');
const path = require('path');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const glob = promisify(require('glob'));
const readFile = promisify(fs.readFile);

const size = require('../size');

const defaults = {
  outDir: 'bramble',
  srcFiles: 'src/**/*.js',
  threshold: 1024
};

module.exports = async args => {
  const { outDir, srcFiles, threshold } = { ...defaults, ...args };
  const schemaFilePath = path.join(outDir, 'schema.json');

  if (!await exists(schemaFilePath)) {
    throw new Error(
      `A schema file at ${schemaFilePath} must exist in order to run checks.`
    );
  }

  const currSchema = JSON.parse(await readFile(schemaFilePath));
  const lastSize = currSchema.data[currSchema.data.length - 1].size;
  const currSize = await size(srcFiles);
  const offsetSize = currSize - threshold;
  const difference = offsetSize - lastSize;

  if (offsetSize > lastSize) {
    console.error(outdent`

      ${chalk.red(`Error: Bundle size over limit!`)}

      Threshold: ${bytes(threshold)}
      Previous: ${bytes(lastSize)}
      Current: ${bytes(currSize)} ${chalk.red(`+${bytes(difference)}`)}

    `);
  } else {
    console.log(outdent`

      ${chalk.green(`Bundle size within normal range.`)}

      Threshold: ${bytes(threshold)}
      Previous: ${bytes(lastSize)}
      Current: ${bytes(currSize)} ${chalk.green(bytes(difference))}

    `);
  }
};
