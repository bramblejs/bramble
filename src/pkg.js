const fs = require('fs');
const memoizeOne = require('memoize-one').default;
const pkgVersions = require('pkg-versions');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

const pkgFilePath = 'package.json';
const schemaFilePath = 'bramble-lock.json';

const getAllVersions = memoizeOne(async function() {
  return pkgVersions((await getPackage()).name)
    .catch(() => {})
    .then(v => (v ? Array.from(v.entries()) : []));
});

const getCurrentVersion = memoizeOne(async function() {
  return (await getPackage()).version;
});

const getLatestVersion = memoizeOne(async function() {
  const versions = await getAllVersions();
  return versions[versions.length - 1];
});

const getPackage = memoizeOne(async function() {
  return (await exists(pkgFilePath))
    ? await JSON.parse(await readFile(pkgFilePath))
    : {};
});

const getSchema = memoizeOne(async function() {
  return (await exists(schemaFilePath))
    ? JSON.parse(await readFile(schemaFilePath))
    : {};
});

const isPublished = memoizeOne(async function() {
  return (await getLatestVersion()) === (await getCurrentVersion());
});

module.exports = {
  getAllVersions,
  getCurrentVersion,
  getLatestVersion,
  getPackage,
  getSchema,
  isPublished
};
