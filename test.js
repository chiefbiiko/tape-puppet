const tape = require('tape')

tape('a trivial test case', t => {
  t.notEqual(36, 44, 'that passes')
  t.end()
})

tape('a browser test case', async t => {
  const res = await fetch('https://raw.githubusercontent.com/chiefbiiko/tape-puppet/master/package.json')
  const pkg = await res.json()
  t.equal(pkg.name, 'tape-puppet', 'just used the browser\'s fetch API')
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

tape.skip('a debug test', t => { // included for demo, skipped for CI automation
  var y, z = 'v'
  ;debugger;
  t.equal(y, z, 'y equals z')
  t.end()
})
