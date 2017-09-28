# bramble

> Elegantly visualising bundle sizes over time.

Bramble is a bundle analyser. It can be easily composed into your build pipeline. It maintains data about, and generates visualisations for your bundle.

## Install

```sh
npm install bramble
```

## Build integration

The recommended ways to setup bramble are:

### Netlify

This means that you can analyse bundles over time as part of PRs and releases.

1. Configure Netlify to run `bramble` (or an NPM script that does so)
2. Point Netlify at the `bramble/` folder (or your configured folder).

### Pre-publish

```json
{
  "scripts": {
    "prepublish": "webpack && bramble"
  }
}
```

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

The data is stored in a JSON schema inside the folder you configure for bramble called `schema.json`. Each entrie inside of `data` represents an analysis entry that is used in visualisation and checking.

The current schema looks something like this.

```json
{
  "data": [{
    "date": "Thu, 28 Sep 2017 01:28:54 GMT",
    "size": 1024,
    "version": "1.0.0"
  }]
}
```
