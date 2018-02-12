const Promise = require('bluebird')

const events = require('./events')
const { users } = require('../core')

module.exports = io => {
    
    users.getOnlineCount()
    io.on('connection', socket => {
        Object.entries(events).forEach(
            ([event, handler]) => socket.on(event, data => handler(socket, io, data))
        )
        users.getConnectionsCount()
            .then(count => socket.emit('UPDATE_ONLINE_USERS_COUNT'))
            .catch(({ status, message }) => io.emit('CONNECT_ERROR', { status, message }))
        users.getConnectionsCount()
            .then(count => socket.emit('UPDATE_ONLINE_USERS_COUNT'))
            .catch(({ status, message }) => io.emit('CONNECT_ERROR', { status, message }))
        /*
            Promise.all([
                users.getOnlineCount(),
                users.getConnectionsCount()
            ]).then(([ onlineCount, connectionCount ]) => {
                io.emit('CONNECT_SUCCESS', { onlineCount, connectionCount })
            }).catch(({ status, message }) => {
                io.emit('CONNECT_ERROR', { status, message })
            })
        */
    })
}