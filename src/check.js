const bytes = require('bytes');
const config = require('./config');
const { getLatestVersion, getSchema } = require('./pkg');
const size = require('./size');

module.exports = async args => {
  const { limit: unparsedLimit, mains, threshold: unparsedThreshold } = {
    ...(await config()),
    ...args
  };

  // If a limit is specified, then it overrides the size stored in the previous schema.
  const limit =
    bytes.parse(unparsedLimit) ||
    ((await getSchema())[await getLatestVersion()] || { size: 0 }).size;

  const threshold = bytes.parse(unparsedThreshold);
  const current = await size(mains);
  const offset = current - threshold;
  const difference = offset - limit;

  // It's valid if there's no size to compare against.
  const valid = !limit || offset < limit;

  // Return computed information for reporting purposes.
  return {
    current,
    difference,
    limit,
    offset,
    threshold,
    valid
  };
};
