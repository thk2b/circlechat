const Promise = require('bluebird')

module.exports = function(condition){
    if(condition) return Promise.resolve()
    return Promise.reject({
        status: 401,
        message: 'unauthenticated'
    })
}