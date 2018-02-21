const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const {
    auth,
    profile
    // user,
    // message
} = require('./modules')

/* API */

app.use((req, res, next) => {
    const rawToken = req.headers.authorization
    if(rawToken){
        const token = rawToken.split(' ')[1]
        auth.service.verifyToken(token)
        .then(userId => req.userId = userId)
        .catch(e => req.userId = null)
        .finally(() => next())
    } else {
        req.userId = null
        next()
    }
})

app.use(bodyParser.json())

const api = new express.Router()

api.use('/auth', auth.router)
api.use('/profile', profile.router)
// api.use('/message', message.router)

app.use('/api/v1', api)

/* SOCKET.IO */

io.on('connection', socket => {
    socket.userId = null
    socket.on('/auth', data => auth.events(socket, io, data))
    socket.on('/user', data => user.events(socket, io, data))
    socket.on('/message', data => message.events(socket, io, data))
})

module.exports = server