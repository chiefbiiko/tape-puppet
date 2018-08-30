// const log = require('why-is-node-running') // should be your first require

const tapePuppet = require('./index.js')

process.stdin
  .pipe(tapePuppet())
  .on('results', results => {
    process.exit(Number(!results.ok))
    // setTimeout(log, 100)
  })
  .pipe(process.stdout)
