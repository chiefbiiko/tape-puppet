const tape = require('tape')

tape('a trivial test case', t => {
  t.notEqual(36, 44, 'that passes')
  t.end()
})

tape('a browser test case', async t => {
  const res = await fetch('https://api.github.com/users/chiefbiiko')
  const usr = await res.json()
  t.equal(usr.login, 'chiefbiiko', 'just used the browser\'s fetch API')
  t.end()
})

tape('yet another browser test case', t => {
  var btn = document.createElement('button')
  btn.onclick = e => {
    t.true(e.target.isSameNode(btn), 'proper browser event')
    document.body.removeChild(btn)
    btn = null
    t.end()
  }
  document.body.appendChild(btn)
  btn.click()
})
