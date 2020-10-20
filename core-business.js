const glob = require('glob')

async function obtainRates(dateStr, rateFetchers, logger) {
  const date = new Date(dateStr)
  const currentDate = new Date()

  if (date.getTime() > currentDate.getTime()) {
    logger.warn({
      type: 'core-business', 'error-class': 'future date', dateStr, currentDate: currentDate.toISOString()
    })
    return Object.keys(rateFetchers).map(source => ({ source, rate: 'n/a' }))
  }

  return await Promise.all(Object.entries(rateFetchers).map(async ([source, fetch]) => {
    try {
      const rate = await fetch(dateStr, logger) 
      return { source, rate }
    } catch(err) {
      logger.error({ err })

      return { source, err: err.message }
    }
  }))
}

module.exports = function initialize(logger) {
  const rateFetchers = glob.sync('*.js', {
    cwd: `rate-fetchers`, mark: false
  }).reduce((rateFetchers, filename) => {
    rateFetchers[filename.replace(/\.js$/, '')] = require(`./rate-fetchers/${filename}`)
    return rateFetchers
  }, {})

  return {
    obtainRates: async (dateStr) => {
      return obtainRates(dateStr, rateFetchers, logger)
    }
  }
}