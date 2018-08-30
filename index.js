const { Transform } = require('stream')
const { inherits } = require('util')
const puppeteer = require('puppeteer')
const finished = require('tap-finished')
const pump = require('pump')

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
  const self = this

  var browser, page
  try {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  } catch (err) {
    return end(err)
  }

  const finisher = finished(this._opts, async results => {
    try {
      await page.close()
      await browser.close()
    } catch (err) {
      return end(err)
    }
    self.emit('results', results)
    end()
  })

  page.on('console', msg => self.push(`${msg._text}\n`))

  pump(self, finisher, err => {
    if (err) return end(err)
  })

  try {
    await page.evaluate(`;(async()=>{${this._accu}})();`)
  } catch (err) {
    return end(err)
  }
}

module.exports = TapePuppetStream
