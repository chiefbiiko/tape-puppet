const { Transform } = require('stream')
const { inherits } = require('util')
const puppeteer = require('puppeteer')
const finished = require('tap-finished')
const pump = require('pump')

const { processOpts, sleep } = require('./utils.js')

const DEVICES = require('./DEVICES.js')

function TapePuppetStream (opts) {
  if (!(this instanceof TapePuppetStream)) return new TapePuppetStream(opts)
  Transform.call(this)
  this._opts = processOpts(Object.assign({}, opts || {}))
  this._accu = Buffer.alloc(0)
  if (this._opts.devices) this.end() // no stdin expected, trigger flush
}

inherits(TapePuppetStream, Transform)

TapePuppetStream.prototype._transform = function transform (chunk, _, next) {
  this._accu = Buffer.concat([ this._accu, chunk ])
  next()
}

TapePuppetStream.prototype._flush = async function flush (end) {
  const self = this

  if (self._opts.devices) { // list device names and quit
    Object.keys(DEVICES).forEach(device_name => self.push(`${device_name}\n`))
    self.destroy()
    return end()
  }

  const shutdown = async err => {
    if (browser) {
      try {
        await browser.close()
      } catch (error) {
        if (!err) err = error
      }
    }
    if (!self.destroyed) self.destroy(err)
    end(err)
  }

  var browser, page
  try {
    browser = await puppeteer.launch(self._opts)
    page = (await browser.pages())[0]
  } catch (err) {
    return await shutdown(err)
  }

  page.on('error', async err => await shutdown(err))
  page.on('pageerror', async err => await shutdown(err))
  page.on('console', msg => self.push(`${msg.text()}\n`))

  pump(self, finished(self._opts, async results => {
    await shutdown()
    self.emit('results', results)
  }))

  try {
    if (DEVICES[self._opts.emulate])
      await page.emulate(DEVICES[self._opts.emulate])
    if (/debugger/.test(self._accu))
      await sleep(1000) // HACK: allow debugger engine startup
    await page.evaluate(String(self._accu))
  } catch (err) {
    return await shutdown(err)
  }
}

module.exports = TapePuppetStream
