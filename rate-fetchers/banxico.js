
const got = require('got')
const parser = require('fast-xml-parser')
const moment = require('moment')

async function fetchFromSite(dateStr, logger) {
  const formatedDate = moment(dateStr).format('YYYY-MM-DD')
  const url = `${process.env.BANXICO_URL}/SieAPIRest/service/v1/series/SF43718/datos/${formatedDate}/${formatedDate}?mediaType=xml`
  const { body } = await got(url, { 
    method: 'GET', 
    headers: {
      'Bmx-Token': process.env.BANXICO_TOKEN
    },
    timeout: parseFloat(process.env.BANXICO_TIMEOUT || 30) * 1000
  })

  return body
}

module.exports = async (dateStr, logger) => {
  try {
    const xmlStr = await fetchFromSite(dateStr, logger)

    try {
      const banxicoRates = parser.parse(xmlStr)
      const rate = banxicoRates?.series?.serie?.Obs?.dato
    
      if (!rate) {
        logger.warn({
          type: 'rate-fetcher', 'rate-fetcher': 'banxico', 'error-class': 'parse',
          dateStr: dateStr,
          message: 'no data',
          xmlStr: xmlStr
        })
    
        return 'n/a'
      }
    
      return rate
    } catch (err) {
      logger.warn({
        type: 'rate-fetcher', 'rate-fetcher': 'banxico', 'error-class': 'parse',
        dateStr: dateStr,
        message: err.message,
        xmlStr: xmlStr
      })
  
      return 'n/a'
    }
  } catch (err) {
    logger.warn({
      type: 'rate-fetcher', 'rate-fetcher': 'banxico', 'error-class': 'fetchFromSite', 
      dateStr: dateStr,
      statusCode: err.response?.statusCode,
      message: err.response?.statusMessage || err.message
    })

    return 'n/a'
  }
}