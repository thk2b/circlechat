const api = require('./api')
const server = require('http').Server(api)
const io = require('./io')(server)

module.exports = server