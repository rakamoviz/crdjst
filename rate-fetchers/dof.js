
const got = require('got')
const cheerio = require('cheerio')
const moment = require('moment')

const URL = process.env.DOF_URL

async function fetchFromSite(dateStr, logger) {
  const formatedDate = moment(dateStr).format('DD/MM/YYYY')

  const { body } = await got(URL, { method: 'POST', timeout: parseFloat(process.env.DOF_TIMEOUT || 30) * 1000, form: {
    idioma: 'sp',
    fechaInicial: formatedDate,
    fechaFinal: formatedDate,
    salida: 'HTML'
  } })

  return body
}

module.exports = async (dateStr, logger) => {
  try {
    const htmlStr = await fetchFromSite(dateStr, logger)

    try {
      const $ = cheerio.load(htmlStr)
  
      const rate = $('body > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td').text().trim()  
      
      if (rate === '') {
        logger.error({
          type: 'rate-fetcher', 'rate-fetcher': 'dof', 'error-class': 'parse', 
          dateStr: dateStr,
          message: 'empty string',
          htmlStr: htmlStr
        })
    
        return 'n/a'
      }
    
      return rate
    } catch (err) {
      logger.error({
        type: 'rate-fetcher', 'rate-fetcher': 'dof', 'error-class': 'parse', 
        dateStr: dateStr,
        message: err.message,
        htmlStr: htmlStr
      })
  
      return 'n/a'
    }
  } catch (err) {
    logger.warn({
      type: 'rate-fetcher', 'rate-fetcher': 'dof', 'error-class': 'fetchFromSite', 
      dateStr: dateStr,
      statusCode: err.response?.statusCode,
      message: err.response?.statusMessage || err.message
    })

    return 'n/a'
  }
}