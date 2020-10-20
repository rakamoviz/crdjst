
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
  const jsonStr = await fetchFromSite(dateStr, logger)
  const fixerRates = JSON.parse(jsonStr)

  return fixerRates['rates']['MXN']
}