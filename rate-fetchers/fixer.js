
const got = require('got')
const moment = require('moment')

async function fetchFromSite(dateStr, logger) {
  const url = `http://${process.env.FIXER_HOST}/api/${moment(dateStr).format('YYYY-MM-DD')}?access_key=${process.env.FIXER_API_KEY}&base=USD&symbols=MXN`
  const { body } = await got(url, { 
    method: 'GET', 
    timeout: parseFloat(process.env.FIXER_TIMEOUT || 30) * 1000
  })

  return body
}

module.exports = async (dateStr, logger) => {
  try {
    const jsonStr = await fetchFromSite(dateStr, logger)
    try {
      const fixerRates = JSON.parse(jsonStr)
      const rate = fixerRates.rates?.MXN
  
      if (!rate) {
        logger.error({
          type: 'rate-fetcher', 'rate-fetcher': 'fixer', 'error-class': 'parse', 
          dateStr: dateStr,
          message: 'empty string',
          jsonStr: jsonStr
        })
    
        return 'n/a'
      }
    
      return rate
    } catch (err) {
      logger.error({
        type: 'rate-fetcher', 'rate-fetcher': 'fixer', 'error-class': 'parse', 
        dateStr: dateStr,
        message: err.message,
        jsonStr: jsonStr
      })
  
      return 'n/a'
    }
  } catch (err) {
    logger.warn({
      type: 'rate-fetcher', 'rate-fetcher': 'fixer', 'error-class': 'fetchFromSite', 
      dateStr: dateStr,
      statusCode: err.response?.statusCode,
      message: err.response?.statusMessage || err.message
    })

    return 'n/a'
  }
}