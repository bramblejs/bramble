const bytes = require('bytes');
const chalk = require('chalk');
const outdent = require('outdent');

const check = require('../check');
const { err, log } = require('../log');

module.exports = async args => {
  const { current, difference, limit, valid } = await check(args);
  if (valid) {
    log(outdent`
      ${chalk.green(`Bundle size within normal range.`)}

      Previous: ${bytes(limit)}
      Current: ${bytes(current)} ${chalk.green(bytes(difference))}
    `);
  } else {
    err(outdent`
      ${chalk.red(`Error: Bundle size over limit!`)}

      Previous: ${bytes(limit)}
      Current: ${bytes(current)} ${chalk.red(`+${bytes(difference)}`)}
    `);
    process.exit(1);
  }
};
