const Promise = require('bluebird')

module.exports = function(condition, name='data'){
    if(condition) return Promise.resolve()
    else return Promise.reject({ status: 422, message: 'invalid '+name })
}