const express, { Router } = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const {
    user,
    message
} = require('./modules')

/* API */

const api = new Router()

api.use('/auth', auth.router)
api.use('/user', user.router)
api.use('/message', message.router)

app.use('/api/v1/', api)

/* SOCKET.IO */

io.on('connection', socket => {
    socket.on('user', data => user.events(socket, io, data))
    socket.on('message', data => message.events(socket, io, data))
})

module.exports = server