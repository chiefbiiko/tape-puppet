const tape = require('tape')

tape('a test case', t => {
  t.pass('that passes')
  t.end()
})

tape('another test case', t => {
  t.notEqual(36, 44, 'that passes')
  t.end()
})
