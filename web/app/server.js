const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const validateSocketIoPayload = require('./lib/validateSocketIoPayload')
const {
    auth,
    profile,
    ping,
    channel,
} = require('./modules')

/* API */

app.use(bodyParser.json())
app.use((req, res, next) => {
    // #48
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



app.locals.io = io

/* Authenticate websocket
** From now on, we know that all connected sockets have a valid token
*/
io.use((socket, next) => {
    const token = socket.handshake.query && socket.handshake.query.token
    auth.service.verifyToken(token)
    .then((userId) => {
        socket.userId = userId
        return next()
    })
    /* socket.emit('unauthorized', e.message) */ 
    .catch(e => {})
})

/* Find this user's socket 
** Add it to locals so that we can broadcast from it in api routes
*/
app.use((req, res, next) => {
    if(!req.userId) return next()
    Object.entries(io.sockets.connected).forEach(
        ([id, socket]) => {
            if(socket.userId && (socket.userId === req.userId) ){
                res.locals.socket = socket
            }
        }
    )
    next()
})

const API_URL = '/api/v1'

app
.use(API_URL+'/auth', auth.router)
.use(API_URL+'/profile', profile.router)
.use(API_URL+'/channel', channel.router)

app.use((err, req, res, next) => {
    res.status(err.status || 500).json(e)
})

const events = {
    '/ping': ping.events,
    '/profile': profile.events
}

io.on('connection', socket => {
    Object.entries(events).forEach(
        ([ event, handler ]) => {
            socket.on('disconnect', () => handler(socket, io, { meta: { type: 'disconnect' } }))
            socket.on(event, payload => {
                validateSocketIoPayload(payload)
                .catch(e => socket.emit(
                    payload && payload.meta && payload.meta.type || 'error', {
                        meta: {...payload? payload.meta? payload.meta : {} : {}, status: e.status || 500 },
                        data: e
                    }
                ))
                .then(() => handler(socket, io, payload))
                
            })
            return handler(socket, io, { meta: { type: 'connect' } })
        }
    )
})

module.exports = server