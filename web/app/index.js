const bodyParser = require('body-parser')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const config = require('./config')

// require('./api')(app)
const api = require('./api')
app.use('/api', api)

require('./io')(io)
server.listen(config.port)

exports = module.exports = server