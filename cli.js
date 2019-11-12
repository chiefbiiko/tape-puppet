#!/usr/bin/env node

const minimist = require('minimist')
const pump = require('pump')
const tapePuppet = require('./index.js')
const version = require('./package.json').version

const exit = code => {
  process.title = ''
  process.exit(code)
}

process.title = `tape-puppet v${version}`

const argv = minimist(process.argv.slice(2), {
  alias: { help: 'h', version: 'v' },
  boolean: 'devtools'
})

argv.headless = ![ 'false', 0 ].includes(argv.headless)

if (argv.version) {
  console.log(`v${version}`)
  exit(0)
}

if (argv.help) {
  console.log(`
    tape-puppet v${version}

    A duplex stream that runs browserified tape tests with puppeteer.
    Just pipe a browserify stream into this and consume its TAP output.

    Usage:

      browserify [opts] [files] | tape-puppet [opts]

    Options:

      -h, --help\t\tprint usage instructions
      -v, --version\t\tprint version
          --headless\trun chromium in headless mode; default: true
          --devtools\topen devtools; forces !headless; default: false
          --emulate\t\temulate a mobile device; fx "iPhone X"
          --devices\t\tlist mobile devices that can be emulated
          --width\t\tchromium window width in px
          --height\t\tchromium window height in px
          --timeout\t\ttimeout for chromium launch in ms; default: 30000
          --wait\t\ttimeout for tap-finished in ms; default: 1000

    Examples:

      browserify ./test.js | tape-puppet
      browserify ./test.js | tape-puppet --devtools
      browserify ./test.js | tape-puppet --headless 0 --emulate "iPhone X"
      browserify ./test.js | tape-puppet > ./test.tap
      `.replace(/^ {4}/gm, ''))
  exit(0)
}

pump(
  process.stdin,
  tapePuppet(argv).once('results', res => exit(res.ok ? 0 : 1)),
  process.stdout,
  err => {
    if (err) {
      console.error(err)
      exit(1)
    }
  }
)
