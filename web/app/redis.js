const config = require('./config')
const redis = require('redis').createClient(config.redis.port, config.redis.host)
redis.select(config.redis.db)

module.exports = redis