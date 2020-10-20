
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
  const htmlStr = await fetchFromSite(dateStr, logger)
  const $ = cheerio.load(htmlStr)

  const rateStr = $('body > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td').text().trim()  
  
  if (rateStr === '') {
    throw new Error('rate not available')
  }

  return parseFloat(rateStr)
}