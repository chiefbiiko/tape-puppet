const tape = require('tape')

tape('a test case', t => {
  t.pass('that passes')
  t.end()
})

tape.skip('another test case', t => {
  t.fail('that fails')
  t.end()
})
