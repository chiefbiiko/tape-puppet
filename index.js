const { PassThrough, Transform } = require('stream')
const { inherits } = require('util')
const { EventEmitter } = require('events')
const puppeteer = require('puppeteer')
const finished = require('tap-finished')

const debug = require('debug')('tape-puppet')

function TapePuppetStream (opts) {
  if (!(this instanceof TapePuppetStream)) return new TapePuppetStream(opts)
  Transform.call(this)
  this._opts = Object.assign({}, { wait: 1000 }, opts || {})
  this._accu = Buffer.alloc(0)
}

inherits(TapePuppetStream, Transform)

TapePuppetStream.prototype._transform = function (chunk, _, next) {
  this._accu = Buffer.concat([ this._accu, chunk ])
  next()
}

TapePuppetStream.prototype._flush = async function (end) {
  var self = this
  const iife = `;(()=>{${this._accu}})();`
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const proxyStream = new PassThrough()
  page.on('console', msg => {
    debug('msg._text::', msg._text)
    self.emit('data', `${msg._text}\n`)
  })
  await page.evaluate(iife)
  proxyStream.pipe(finished(this._opts, async results => {
    await page.close()
    await browser.close()
    self.emit('results', results)
    end()
  }))
}

module.exports = TapePuppetStream
