const { getLatestVersion, getSchema } = require('./pkg');
const size = require('./size');

module.exports = async ({ limit, mains, threshold }) => {
  const latestVersion = await getLatestVersion();
  const currentSchema = await getSchema();
  const latestSchema = currentSchema[latestVersion] || { size: 0 };
  const latestSize = latestSchema.size;
  const currentSize = await size(mains);
  const offsetSize = currentSize - threshold;
  const difference = offsetSize - latestSize;
  return {
    currentSize,
    difference,
    latestSize,
    offsetSize,
    isValid:
      (!latestSize || offsetSize < latestSize) && (!limit || offsetSize < limit)
  };
};
