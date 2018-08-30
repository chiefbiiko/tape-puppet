const tapePuppet = require('./index.js')
const pump = require('pump')

const errLANDexit = err => err && (console.error(err) && process.exit(1))

const tapePuppetStream = tapePuppet()
  .once('results', results => process.exit(Number(!results.ok)))
  .once('error', errLANDexit)

pump(process.stdin, tapePuppetStream, process.stdout, errLANDexit)
