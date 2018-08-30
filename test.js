const tape = require('tape')

tape('a test case', async t => {
  const res = await fetch('https://api.github.com/users/chiefbiiko')
  const usr = await res.json()
  t.equal(usr.login, 'chiefbiiko', 'just used the browser\'s fetch API')
  t.end()
})

tape('another test case', t => {
  t.notEqual(36, 44, 'that passes')
  t.end()
})
