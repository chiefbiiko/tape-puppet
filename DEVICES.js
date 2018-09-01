module.exports = require('puppeteer/DeviceDescriptors.js')
  .reduce((acc, cur) => {
    if (!acc.hasOwnProperty(cur.name)) acc[cur.name] = cur
    return acc
  }, {})
