const Promise = require('bluebird')

const redis = require('../redis')

module.exports.join = function(){
    return new Promise((resolve, reject) => {
        Promise.all([
            new Promise((resolve, reject) => {
                redis.incr('online_users_count', (err, count) => {
                    if(err) reject(err) 
                    resolve(count)
                })
            }),
            new Promise((resolve, reject) => {
                redis.incr('connections_count', (err, count) => {
                    if(err) reject(err)
                    resolve(count)
                })
            })
        ]).then(([ onlineCount, connectionCount ]) => {
            resolve({ onlineCount, connectionCount })
        }).catch(e => reject(e))
    }) 
}

module.exports.leave = function(){
    return new Promise((resolve, reject) => {
        redis.incrby('online_users_count', -1, (err, count) => {
            if(err) reject(err) 
            resolve(count)
        })
    })
}