const tapePuppet = require('./index.js')
const pump = require('pump')
const dealias = require('aka-opts')
const version = require('./package.json').version

const exit = code => {
  process.title = ''
  process.exit(code)
}

var argv = dealias(require('yargs').argv, { help: [ 'h' ], version: [ 'v' ]})

argv.headless = ![ 'false', '0' ].includes(argv.headless)
process.title = `tape-puppet v${version}`

if (argv.help) {
  console.log(`tape-puppet v${version}\n\n` +
    `A duplex stream that runs browserified tape tests with puppeteer.\n` +
    `Just pipe a browserify stream into this and consume its TAP output.\n\n` +
    `Usage:\n\n` +
    `  browserify [opts] [files] | tape-puppet [opts]\n\n` +
    `Options:\n\n` +
    `  -h, --help\t\tprint usage instructions\n` +
    `  -v, --version\t\tprint version\n` +
    `      --headless\trun chromium in headless mode; default: true\n` +
    `      --devtools\topen devtools; forces !headless: default: false\n` +
    `      --slowMo\t\tslow down puppeteer by specified ms; default: 0\n` +
    `      --wait\t\ttimeout for tap-finished in ms, default: 1000\n` +
    `      --timeout\t\ttimeout for chromium launch in ms. default: 30000\n\n` +
    `Examples:\n\n` +
    `  browserify ./test.js | tape-puppet\n` +
    `  browserify ./test.js | tape-puppet > ./test.tap`)
  exit(0)
}

const tapePuppetStream = tapePuppet(argv)
  .once('results', results => exit(Number(!results.ok)))

pump(process.stdin, tapePuppetStream, process.stdout, err => {
  if (err) {
    console.error(err)
    exit(1)
  }
})
