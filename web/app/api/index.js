const api = require('express')()
api.route('/').get(() => console.log('a'))
api.use('api/messages', require('./messages'))
api.use('api/ping', require('./ping'))

module.exports = api