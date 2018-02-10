const bodyParser = require('body-parser')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

require('./api')(app)
require('./io')(io)

exports = module.exports = server