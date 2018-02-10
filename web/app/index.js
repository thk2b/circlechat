const bodyParser = require('body-parser')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const config = require('./config')

require('./api')(app)
require('./io')(io)

server.listen(config.port, () => {
    console.log(`app listening on port ${config.port}. NODE_ENV is ${process.env.NODE_ENV}`)
})

exports = module.exports = server