# tape-puppet

[![build status](http://img.shields.io/travis/chiefbiiko/tape-puppet.svg?style=flat)](http://travis-ci.org/chiefbiiko/tape-puppet) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/tape-puppet?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/tape-puppet) [![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./security.md)

***

A test runner for [`browserify`](https://github.com/browserify/browserify)'d [`tape`](https://github.com/substack/tape) tests, runs [`puppeteer`](https://github.com/GoogleChrome/puppeteer). Inspired by [`tape-run`](https://github.com/juliangruber/tape-run). Dead simple.

Features Chromium DevTools debugging and device emulation.

Meant to be used with `browserify`. If you want this to work with other bundlers open an [issue](https://github.com/chiefbiiko/tape-puppet/issues).

***

## Get it!

For `npm` scripts or programmatic usage:

```
npm install --save-dev tape-puppet@latest
```

Globally:

```
npm install --global tape-puppet@latest
```

Make sure to also have `browserify` available.

***

## Usage

Write ordinary `tape` tests while using browser APIs in your test cases! Check out [`./test.js`](./test.js) for examples.

### CLI

Run below from a terminal or set it as your `package.json`'s test command:

```
browserify ./test.js | tape-puppet
```

Run `tape-puppet -h` for usage instructions:

```
tape-puppet v0.2.1

A duplex stream that runs browserified tape tests with puppeteer.
Just pipe a browserify stream into this and consume its TAP output.

Usage:

  browserify [opts] [files] | tape-puppet [opts]

Options:

  -h, --help		print usage instructions
  -v, --version		print version
      --headless	run chromium in headless mode; default: true
      --devtools	open devtools; forces !headless; default: false
      --autoclose	close chromium when program completes; default: true
      --debug		Add a breakpoint (debugger) before all code; default: false
      --emulate		emulate a mobile device; fx "iPhone X"
      --devices		list mobile devices that can be emulated
      --cover		Write coverage information to nyc_output.
      --width		chromium window width in px
      --height		chromium window height in px
      --timeout		timeout for chromium launch in ms; default: 30000
      --wait		timeout for tap-finished in ms; default: 1000

Examples:

  browserify ./test.js | tape-puppet
  browserify ./test.js | tape-puppet --devtools
  browserify ./test.js | tape-puppet --headless 0 --emulate "iPhone X"
  browserify ./test.js | tape-puppet > ./test.tap

```

### Debugging

You can have a visible Chromium window pop up by setting option `headless` to `false`. Running such a Chromium head allows further debugging. You can automatically open Chromium DevTools by setting option `devtools` to `true`. Moreover, an open DevTools tab enables `debugger` statements in your tape tests, meaning you can literally do sth similar to this:

1. Throw `debugger` statements into your `tape` test cases:

``` js
// example ./test.js
const tape = require('tape')

tape('a debug test', t => {
  var y, z = 'v'
  ;debugger;
  t.equal(y, z, 'y equals z')
  t.end()
})
```

2. Run `tape-puppet` in non-headless mode and with DevTools:

```
browserify ./test.js | tape-puppet --devtools
```

A Chromium head plus its DevTools will open and script execution will pause at the specified breakpoints...happy debugging!

3. Run `tape-puppet` in non-autoclose mode and with DevTools:

```
browserify ./test.js | tape-puppet --autoclose false
```

A Chromium browser will open and it will stay opened until you manually
close it, this allows you to debug the HTML with the DOM inspector even
after all the tests have passed successfully.

4. Run `tape-puppet` with `--debug`

If you want to step throw all the code and figure out what's going
on in node_modules before your tests or you want to add breakpoints
in the chrome devtools manually without `;debugger;` in the source
code you can open the tests with `--debug`

```
browserify ./test.js | tape-puppet --autoclose false --debug
```

This will cause the devtools to be paused before we evaluate any
of the javascript from `browserify ./test.js` and allows you to
use the DevTools before any code from `node_modules` is run.

### Code coverage

It's possible to use existing techniques for browser code coverage
with `tape-puppet`.

For example

```
browserify ./test.js -t browserify-istanbul | tape-puppet --cover
```

The `browserify-istanbul` transformation will instrument your bundle
with code coverage information.

The `--cover` flag for `tape-puppet` will output the code coverage
from the `puppeteer` process into `./.nyc_output`.

Now you can run `nyc report`

```
nyc report
```

To view the code coverage report of the puppeteer program.

### Emulation

A set of mobile devices can be emulated by setting option `emulate` to a device name string. CLI example:

```
browserify ./test.js | tape-puppet --emulate "iPhone X"
```

List the names of all covered devices by setting option `devices`. CLI example:

```
tape-puppet --devices
```

### `node`

#### `new TapePuppetStream([opts])`

Create a new `TapePuppetStream` instance, a transform stream. See above for available options. Note that options `emulate` and `devices` are available with the CLI only. Moreover, dictating window width and height programmatically requires setting `opts.args` to an array that includes a string like `--window-size=${width},${height}`.

The implementation is nothing more than a duplex stream. Pipe it, pump it, whatever...

***

## License

[MIT](./license.md)
