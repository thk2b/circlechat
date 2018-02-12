const Promise = require('bluebird')
const socketIo = require('socket.io')

const events = require('./events')
const { user } = require('../core')


module.exports = function(server){
    const io = socketIo(server)

    io.on('connection', socket => {
        Object.entries(events).forEach(
            ([event, handler]) => socket.on(event, data => handler(socket, io, data))
        )

        user.join()
            .then(({ onlineCount, connectionCount }) => {
                socket.emit('UPDATE_ONLINE_USERS_COUNT', onlineCount)
                socket.emit('UPDATE_CONNECTIONS_COUNT', connectionCount)
            })
            .catch(({ status, message }) => io.emit('CONNECT_ERROR', { status, message }))
    })
}