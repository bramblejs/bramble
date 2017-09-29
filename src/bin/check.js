const bytes = require('bytes');
const chalk = require('chalk');
const outdent = require('outdent');

const check = require('../check');
const { err, log } = require('../log');

module.exports = async args => {
  const { currentSize, difference, latestSize, isValid } = await check(args);
  if (isValid) {
    log(outdent`
      ${chalk.green(`Bundle size within normal range.`)}

      Previous: ${bytes(latestSize)}
      Current: ${bytes(currentSize)} ${chalk.green(bytes(difference))}
    `);
  } else {
    err(outdent`
      ${chalk.red(`Error: Bundle size over limit!`)}

      Previous: ${bytes(latestSize)}
      Current: ${bytes(currentSize)} ${chalk.red(`+${bytes(difference)}`)}
    `);
    process.exit(1);
  }
};
