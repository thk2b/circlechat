const redis = require('../redis')
const db = require('../db')
const events = require('./events')

module.exports = io => {
    io.on('connection', socket => {
        Object.entries(events).forEach(
            ([event, handler]) => socket.on(event, data => handler(socket, io, data))
        )

        redis.multi()
        redis.incr('online_users_count', (err, count) => {
            if(err) return 
            io.emit('UPDATE_ONLINE_USERS_COUNT', count)
        })
        const connections_count = redis.incr('connections_count', (err, count) => {
            if(err) return
            io.emit('UPDATE_CONNECTIONS_COUNT', count)
        })
        socket.emit('CONNECT_SUCCESS', 'conn')   
    })
}