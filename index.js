const { Transform } = require('stream')
const { inherits } = require('util')
const puppeteer = require('puppeteer')
const finished = require('tap-finished')
const fs = require('fs')
const path = require('path')
const pump = require('pump')

const COVERAGE_FOLDER = path.join(process.cwd(), '.nyc_output')

const { processOpts, sleep } = require('./utils.js')

function TapePuppetStream(opts) {
  if (!(this instanceof TapePuppetStream)) return new TapePuppetStream(opts)
  Transform.call(this)
  this._opts = processOpts(Object.assign({}, opts || {}))
  this._accu = Buffer.alloc(0)
  if (this._opts.devices) this.end() // no stdin expected, trigger flush
}

inherits(TapePuppetStream, Transform)

TapePuppetStream.prototype._transform = function transform(chunk, _, next) {
  this._accu = Buffer.concat([this._accu, chunk])
  next()
}

TapePuppetStream.prototype._flush = async function flush(end) {
  const self = this

  if (self._opts.devices) {
    // list device names and quit
    Object.keys(puppeteer.KnownDevices).forEach(device_name =>
      self.push(`${device_name}\n`)
    )
    self.destroy()
    return end()
  }

  const shutdown = async err => {
    if (!this._opts.autoclose) {
      return new Promise(() => {
        /* hang forever */
      })
    }

    if (self._opts.cover) {
      await new Promise(async resolve => {
        const dumpCoverage = payload => {
          fs.mkdirSync(COVERAGE_FOLDER, { recursive: true })
          const cov = JSON.parse(payload)
          fs.writeFileSync(
            path.join(COVERAGE_FOLDER, 'coverage.json'),
            JSON.stringify(cov, null, 2),
            'utf8'
          )
          return resolve()
        }

        await page.exposeFunction('dumpCoverage', payload => {
          dumpCoverage(payload)
        })

        await page.evaluate(async () => {
          dumpCoverage(JSON.stringify(__coverage__))
        })
      })
    }

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
    console.error('Could not launch puppeteer')
    console.error(err)
    return await shutdown(err)
  }

  page.on('error', async err => {
    console.error('Received error from puppeteer')
    console.error(err)
    await shutdown(err)
  })
  page.on('pageerror', async err => {
    console.error('Received pageerror from puppeteer')
    console.error(err)
    await shutdown(err)
  })
  page.on('console', msg => self.push(`${msg.text()}\n`))

  pump(
    self,
    finished(self._opts, async results => {
      await shutdown()
      self.emit('results', results)
    })
  )

  try {
    if (puppeteer.KnownDevices[self._opts.emulate])
      await page.emulate(puppeteer.KnownDevices[self._opts.emulate])
    if (/debugger/.test(self._accu) || this._opts.debug) await sleep(1000) // HACK: allow debugger engine startup

    if (this._opts.debug) {
      await page.evaluate('debugger;')
    }

    await page.addScriptTag({
      type: 'text/javascript',
      content: String(self._accu),
    })
  } catch (err) {
    console.error('Could not evaluate javascript')
    console.error(err)
    return await shutdown(err)
  }
}

module.exports = TapePuppetStream
