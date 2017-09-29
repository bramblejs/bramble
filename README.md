# bramble

> Elegantly visualising bundle sizes over time.

Bramble is a bundle analyser. It can be easily composed into your build pipeline. It maintains data about, and generates visualisations for your bundle.

## Install

```sh
npm install bramble
```

## Why

If you've ever wondered what your package's overall size looks like over time - or wanted to regression test based on thresholds or limits - Bramble will help you do just that.

Bramble (via [source-trace](https://github.com/treshugart/source-trace)) can work on your raw source even if it's VanillaJS, Stage-0 features, JSON, Flow, or TypeScript, and it will follow all dependencies down the tree using Node's module resolution algorithm. It will ignore all dependencies such as `devDependencies` and `peerDependencies`, and will only include what's listed each module's `dependencies` across the entire dependency graph.

### Differences to [size-limit](https://github.com/ai/size-limit)

Bramble is similar to size-limit in that it can fail a build based on a limit, but that's really the only similarities it shares.

- Bramble is build agnostic; run on any JS variant and module system.
- It has a `check` function that can use a hard `limit`, but also allows you to specify a `threshold` that is used to compare it to the bundle size of the previous version.
- It tracks your bundle size over time and provides a way to generate a graph to visualise it.

Bramble is actually complementary to size-limit. Bramble can identify size and regressions overtime where size-limit can tell you very specific information about your WebPack build.

## Build integration

The recommended ways to setup bramble are as follows.

### Before committing the bumped version

NPM provides a `version` hook that gets executed *after* bumping the version in the `package.json` and *before* that version is committed and tagged. This is the recommended place to update the `bramble-lock.json` file.

```json
{
  "scripts": {
    "version": "bramble write && git add . --ignore-errors"
  }
}
```

The `bramble write` command updates the lockfile and you must call `git add .` to add the lockfile to the stage so NPM can commit and tag it. We must `--ignore-errors` because if `git add` doesn't add any files, it will exit with a non-zero status code preventing the push.

If you opt-out of using the `version` hook, it's up to you to ensure that your lockfile is updated and committed prior to publishing.

### Before pushing

Not only does Bramble record the information for the version that's currently in the `package.json`, it will also record data for the "unreleased" version if the version specified in the `package.json` already exists on NPM. This is because most do nothing with the version after releasing until the next time they release.

We also don't want to overwrite any data that's been published. However, we don't care if we overwrite the unreleased data. This means changes made on a particular branch will accumulate until released.

To set up a `prepush` hook, you can use something like [Husky](https://github.com/typicode/husky). If using Husky, you can simply add a `prepush` script.

```json
{
  "scripts": {
    "prepush": "bramble write && git add . && git commit --allow-empty -am 'Update bramble-lock.json.'"
  }
}
```

This is much like the `version` hook except that you must commit the resulting change otherwise it will only be staged and you'd have to manually do this. We have to `--allow-empty` errors here because `git commit` will exit with a non-zero status if there is nothing to commit.

#### What about on pre-commit?

You could run this on `precommit` (via Husky, like `prepush`) in the same way the `version` hook is run, however, you might find that if you're committing a lot that it gets a bit annoying to have to wait for the file to be updated. If you *do* want to do this, just create a `precommit` script that does the same thing as `version`.

```json
{
  "script": {
    "precommit": "bramble write && git add . --ignore-errors"
  }
}
```

Since this is just before committing, the `git add .` bit will ensure the files are added to the commit.

### Netlify

This means that you can analyse bundles over time as part of PRs and releases.

1. Configure Netlify to run `bramble build` (or an NPM script that does so)
2. Point Netlify at the `bramble/` folder (or whatever you passed to `out-dir`).

## Regression testing

Since bramble tracks the state of your bundle sizes over time, you can run a check at build time to fail the build if your bundle doesn't meet a specific threshold.

For example, you can run this as part of your test step:

```sh
{
  "scripts": {
    "test": "webpack && bramble check --threshold 10k"
  }
}
```

## JSON schema

The data is stored in a JSON schema inside the folder you configure for bramble called `bramble-lock.json`. Each entries in the dictionary represent a version and its corresponding data.

The current schema looks something like this.

```json
{
  "0.1.0": {
    "date": "Thu, 28 Sep 2017 01:28:54 GMT",
    "size": 2048,
    "threshold": 1024
  },
  "1.0.0": {
    "date": "Thu, 28 Sep 2017 01:28:54 GMT",
    "size": 2048,
    "threshold": 1024
  },
  "unreleased": {
    "date": "Thu, 28 Sep 2017 01:28:54 GMT",
    "size": 2048,
    "threshold": 1024
  }
}
```

## Update algorithm

When updating the bramble file it does the following:

1. Get the current version.
2. Get all versions from NPM.
3. Check if the current version has been published.
  - If it has, use "unreleased" as the current version instead.
  - Continue using the current version.
