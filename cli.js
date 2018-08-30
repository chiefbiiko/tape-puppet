const tapePuppet = require('./index.js')
const pump = require('pump')
const optimist = require('optimist')

const argv = optimist
  .usage('Pipe a browserify stream into this.\nbrowserify [opts] [files] | $0 [opts]')
  .describe('wait', 'Timeout for tap-finished')
  .alias('w', 'wait')
  .describe('help', 'Print usage instructions')
  .alias('h', 'help')
  .argv

if (argv.help) return optimist.showHelp()

const tapePuppetStream = tapePuppet()
  .once('results', results => process.exit(Number(!results.ok)))

pump(process.stdin, tapePuppetStream, process.stdout, err => {
  if (err) console.error(err)
})
