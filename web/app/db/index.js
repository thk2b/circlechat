const pgp = require('pg-promise')()

const config = require('../config')

const db = pgp(config.postgres.url)

module.exports = db