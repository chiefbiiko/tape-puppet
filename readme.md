# tape-puppet

[![build status](http://img.shields.io/travis/chiefbiiko/tape-puppet.svg?style=flat)](http://travis-ci.org/chiefbiiko/tape-puppet) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/tape-puppet?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/tape-puppet) [![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./security.md)

***

A test runner for [`browserify`](https://github.com/browserify/browserify)'d [`tape`](https://github.com/substack/tape) tests, runs [`puppeteer`](https://github.com/GoogleChrome/puppeteer). Inspired by [`tape-run`](https://github.com/juliangruber/tape-run). Dead simple.

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

### CLI

```
browserify ./test.js | tape-puppet
```

Run `tape-puppet -h` for usage instructions:

```
tape-puppet v0.0.3

A duplex stream that runs browserified tape tests with puppeteer.
Just pipe a browserify stream into this and consume its TAP output.

Usage:

  browserify [opts] [files] | tape-puppet [opts]

Options:

  -h, --help            print usage instructions
  -v, --version         print version
      --headless        run chromium in headless mode; default: true
      --devtools        open devtools; forces !headless: default: false
      --slowMo          slow down puppeteer by specified ms; default: 0
      --wait            timeout for tap-finished in ms, default: 1000
      --timeout         timeout for chromium launch in ms. default: 30000

Examples:

  browserify ./test.js | tape-puppet
  browserify ./test.js | tape-puppet > ./test.tap
```

***

### `node`

#### `new TapePuppetStream([opts])`

Create a new `TapePuppetStream` instance, a transform stream. See above for available options.

***

## License

[MIT](./license.md)
