const express = require('express')
const jwt = require('jsonwebtoken')
const moment = require('moment')
require('moment-timezone')
const rateLimit = require('express-rate-limit')
 
function initialize(coreBusiness, logger) {
  const app = express()
  const port = process.env.EXPRESS_PORT
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // see https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', process.env.APP_TRUST_PROXY)
  
  const limiter = rateLimit({
    windowMs: parseFloat(process.env.APP_RATELIMIT_WINDOW) * 60 * 1000,
    max: parseInt(process.env.APP_RATELIMIT_MAX)
  })
  
  app.use(limiter)
  app.use(authenticateToken)
  
  app.get('/rates', async (req, res) => {
    /**
     * The core-business.obtainRates expects date in ISO8601 format.
     * At this point we assume the date coming from the client as query parameter
     * already contains timezone information of the client.
     * For examole: 2020-10-20T12:00:00-05:00
     */
    if (!req.query.date) {
      return res.status(400).send('date is required as query parameter')
    }
    
    if (!moment(req.query.date, moment.ISO_8601, true).isValid()) {
      return res.status(400).send('date format must conform to iso8601')
    }

    const rates = await coreBusiness.obtainRates(req.query.date)
    res.status(200).json(rates)
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

module.exports = initialize