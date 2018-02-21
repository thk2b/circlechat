const Promise = require('bluebird')
const { assert, oneOf } = require('duck-check')

module.exports = function(data){
    const ok = assert({
        meta: {
            type: String
        }
    })
    if(ok(data)) return Promise.resolve()
    return Promise.reject({ status: 400, message: 'invalid socketwebsocket message'})
}

