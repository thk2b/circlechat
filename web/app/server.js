const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const {
    auth,
    profile,
    ping
    // user,
    // message
} = require('./modules')

/* API */

app.use(bodyParser.json())
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

app.use((req, res, next) => { /* find this user's socket and add it to locals so that we can broadcast from it in routes */
    if(!req.userId) return next()
    Object.entries(io.sockets.connected).forEach(
        ([id, socket]) => {
            if(socket.userId === req.userId){ /* userId is set by io auth middleware */
                res.locals.socket = socket
            }
        }
    )
    next()
})

const api = new express.Router()

api.use('/auth', auth.router)
api.use('/profile', profile.router)
// api.use('/message', message.router)

app.use('/api/v1', api)

/* SOCKET.IO */
app.locals.io = io

io.use((socket, next) => { /* authenticate websocket */
    const token = socket.handshake.query && socket.handshake.query.token
    auth.service.verifyToken(token)
    .then((userId) => {
        socket.userId = userId
        return next()
    })
    .catch(e => {
        // socket.emit('unauthorized', e.message)
        return
    })
})

io.on('connection', socket => {
    socket.on('/ping', data => ping.events(socket, io, data))
    // socket.on('/user', data => user.events(socket, io, data))
    // socket.on('/message', data => message.events(socket, io, data))
})

module.exports = server