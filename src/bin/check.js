const bytes = require('bytes');
const chalk = require('chalk');
const outdent = require('outdent');
const pkgVersions = require('pkg-versions');

const { getLatestVersion, getSchema } = require('../pkg');
const { err, log } = require('../log');
const size = require('../size');

module.exports = async ({ limit, mains, threshold }) => {
  const latestVersion = await getLatestVersion();
  const currentSchema = await getSchema();

  if (!latestVersion) {
    err(chalk.red(`There is no previous version to compare to.`));
  }

  const latestSchema = currentSchema[latestVersion];
  const latestSize = latestSchema.size;
  const currentSize = await size(mains);
  const offsetSize = currentSize - threshold;
  const difference = offsetSize - latestSize;

  if (offsetSize > latestSize || (limit && offsetSize > limit)) {
    err(outdent`
      ${chalk.red(`Error: Bundle size over limit!`)}

      Threshold: ${bytes(threshold)}
      Previous: ${bytes(latestSize)}
      Current: ${bytes(currentSize)} ${chalk.red(`+${bytes(difference)}`)}
    `);
    process.exit(1);
  } else {
    log(outdent`
      ${chalk.green(`Bundle size within normal range.`)}

      Threshold: ${bytes(threshold)}
      Previous: ${bytes(latestSize)}
      Current: ${bytes(currentSize)} ${chalk.green(bytes(difference))}
    `);
  }
};
