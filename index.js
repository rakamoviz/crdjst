const bunyan = require('bunyan')

const logger = bunyan.createLogger({ name: process.env.APP_NAME })

const coreBusiness = require('./core-business')(logger)
const server = require('./server')(coreBusiness, logger)
