const api = require('express')()

api.use('/api/messages', require('./messages'))
api.use('/api/ping', require('./ping'))

module.exports = api