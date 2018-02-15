const Promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: Promise})

const config = require('./config')

const db = pgp(config.postgres.url)

module.exports = db