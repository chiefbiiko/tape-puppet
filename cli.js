const tapePuppet = require('./index.js')

process.stdin
  .pipe(tapePuppet())
  .once('results', results => process.exit(Number(!results.ok)))
  .pipe(process.stdout)
