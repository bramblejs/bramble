function err(message, code = 1) {
  console.error(`\n${message}\n`);
  process.exit(code);
}

function log(message, code) {
  console.log(`\n${message}\n`);
  typeof code === 'number' && process.exit(code);
}

module.exports = {
  err,
  log
};
