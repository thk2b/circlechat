const bodyParser = require('body-parser')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const config = require('./config')
const api = require('./api')
require('./io')(io)

app.use('/api', api)
server.listen(config.port)






