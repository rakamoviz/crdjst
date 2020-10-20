
const got = require('got')
const parser = require('fast-xml-parser')
const moment = require('moment')

async function fetch(dateStr, logger) {
  const formatedDate = moment(dateStr).format('YYYY-MM-DD')

  console.log(`${process.env.BANXICO_URL}/SieAPIRest/service/v1/series/SF43718/datos/${formatedDate}/${formatedDate}?mediaType=xml`)
  const url = `${process.env.BANXICO_URL}/SieAPIRest/service/v1/series/SF43718/datos/${formatedDate}/${formatedDate}?mediaType=xml`
  const { body } = await got(url, { 
    method: 'GET', 
    headers: {
      'Bmx-Token': process.env.BANXICO_TOKEN
    },
    timeout: parseFloat(process.env.BANXICO_TIMEOUT || 30) * 1000
  })

  const banxicoRates = parser.parse(body)
  return banxicoRates.series.serie.Obs.dato
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