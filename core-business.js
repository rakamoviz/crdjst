const glob = require('glob')

async function obtainRates(dateStr, rateFetchers, logger) {
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