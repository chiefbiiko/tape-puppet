const tapePuppet = require('./index.js')
const pump = require('pump')
const version = require('./package.json').version
const argv = require('yargs').argv

process.title = `tape-puppet v${version}`

if (argv.h || argv.help) {
  console.log(`tape-puppet v${version}\n\n` +
    `A duplex stream that runs browserified tape tests with puppeteer.\n` +
    `Just pipe a browserify stream into this and consume its TAP output.\n\n` +
    `Usage:\n\n` +
    `  browserify [opts] [files] | tape-puppet [opts]\n\n` +
    `Options:\n\n` +
    `  -w, --wait    Timeout for tap-finished\n` +
    `  -h, --help    Print usage instructions\n\n` +
    `Examples:\n\n` +
    `  browserify ./test.js | tape-puppet\n` +
    `  browserify ./test.js | tape-puppet > ./test.tap`)
  process.exit(0)
}

const tapePuppetStream = tapePuppet(argv)
  .once('results', results => process.exit(Number(!results.ok)))

pump(process.stdin, tapePuppetStream, process.stdout, err => {
  if (err) console.error(err)
})
