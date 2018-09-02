const compose = (...funcs) => input => {
  return funcs.reduceRight((acc, func) => func(acc), input)
}

const noSandboxOnTravis = opts => {
  if ('CI' in process.env && 'TRAVIS' in process.env) {
    const chromium_flags = [ '--no-sandbox', '--disable-setuid-sandbox' ]
    if (Array.isArray(opts.args)) opts.args = opts.args.concat(chromium_flags)
    else opts.args = chromium_flags
  }
  return opts
}

const checkWidthHeight = opts => {
  if (typeof opts.width === 'number' || typeof opts.height === 'number') {
    const size = [ `--window-size=${opts.width || 800},${opts.height || 600}` ]
    if (Array.isArray(opts.args)) opts.args = opts.args.concat(size)
    else opts.args = size
  }
  return opts
}

const allowDevtools = opts => {
  if (opts.devtools) opts.headless = false
  return opts
}

const processOpts = compose(allowDevtools, checkWidthHeight, noSandboxOnTravis)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = { processOpts, sleep }
