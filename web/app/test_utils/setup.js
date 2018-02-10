const test = require('tape')
const db = require('../db')
const redis = require('../redis')
const create = require('../db/create')
const seed = require('../db/seed')
const drop = require('../db/drop')


module.exports = function(){
    test('setup', t => {
        drop(db)
            .then(() => create(db))
            .then(() => redis.flushall(() => t.end()))
            .catch(e => t.fail(`failed to setup: ${e}`))
    })
}