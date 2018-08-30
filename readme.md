# tape-puppet

[![build status](http://img.shields.io/travis/chiefbiiko/tape-puppet.svg?style=flat)](http://travis-ci.org/chiefbiiko/tape-puppet) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/tape-puppet?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/tape-puppet) [![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./security.md)

***

A test runner for [`browserify`](https://github.com/browserify/browserify)'d [`tape`](https://github.com/substack/tape) tests, using headless [`puppeteer`](https://github.com/GoogleChrome/puppeteer). Inspired by [`tape-run`](https://github.com/juliangruber/tape-run). Dead simple.

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

Run `tape-puppet -h` for usage instructions.

***

## API

### `stream = new TapePuppetStream([opts])`

Create a new `TapePuppetStream` instance. `opts.wait` can be an integer value indicating the timeout for [`tap-finished`](https://github.com/substack/tap-finished).

***

## License

[MIT](./license.md)
