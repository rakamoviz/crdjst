
const got = require('got')
const cheerio = require('cheerio')
const moment = require('moment')

async function fetch(dateStr, logger) {
  const url = `http://${process.env.FIXER_HOST}/api/${moment(dateStr).format('YYYY-MM-DD')}?access_key=${process.env.FIXER_API_KEY}&base=USD&symbols=MXN`
  const { body } = await got(url, { 
    method: 'GET', 
    timeout: parseFloat(process.env.FIXER_TIMEOUT || 30) * 1000, 
    responseType: 'json' 
  })

  return body['rates']['MXN']
}

module.exports = function initialize(logger) {
  return {
    fetch: async (dateStr) => {
      try {
        const rate = await fetch(dateStr, logger) 
        return { rate }
      } catch(err) {
        logger.error({err: err})

        return {
          err: err.message
        }
      }
    }
  }
}