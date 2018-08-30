# tape-puppet

[![build status](http://img.shields.io/travis/chiefbiiko/tape-puppet.svg?style=flat)](http://travis-ci.org/chiefbiiko/tape-puppet) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/tape-puppet?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/tape-puppet) [![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./security.md)

***

A duplex stream that runs browserified tape tests with puppeteer. Inspired by [`tape-run`](https://github.com/juliangruber/tape-run).

***

## Get it!

For programmatic or `npm` scripts usage:

```
npm install --save-dev tape-puppet
```

Globally:

```
npm install --global tape-puppet
```

***

## Usage

```
browserify ./test.js | tape-puppet
```

> Warning: your tests will hang if there are unhandled errors in any test case.

***

## API

### `stream = new TapePuppetStream([opts])`

Create a new stream. `opts.wait` can be an integer value indicating the timeout for [`tap-finished`](https://github.com/substack/tap-finished).

***

## License

[MIT](./license.md)
