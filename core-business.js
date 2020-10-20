const glob = require('glob')

async function obtainRates(dateStr, rateFetchers, logger) {
  return await Promise.all(Object.entries(rateFetchers).map(async ([source, rateFetcher]) => {
    return {
      source, 
      ...(await rateFetcher.fetch(dateStr, logger))
    }
  }))
}

module.exports = function initialize(logger) {
  const rateFetchers = glob.sync('*.js', {
    cwd: `rate-fetchers`, mark: false
  }).reduce((rateFetchers, filename) => {
    rateFetchers[filename.replace(/\.js$/, '')] = require(`./rate-fetchers/${filename}`)(logger)
    return rateFetchers
  }, {})

  return {
    obtainRates: async (dateStr) => {
      return obtainRates(dateStr, rateFetchers, logger)
    }
  }
}