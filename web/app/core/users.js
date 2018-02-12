const Promise = require('bluebird')

const redis = require('../redis')

module.exports.getOnlineCount = function(){
    return new Promise((resolve, reject) => {
        redis.multi() // not needed?
        redis.incr('online_users_count', (err, count) => {
            if(err) reject(err) 
            resolve(count)
        })
    })
}
module.exports.getConnectionsCount = function(){
    return new Promise((resolve, reject) => {
        redis.multi()
        redis.incr('connections_count', (err, count) => {
            if(err) reject(err)
            resolve(count)
        })
    })
}
