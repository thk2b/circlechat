const redis = require('../redis')
const db = require('../db')
// const {
//     disconnect
// } = require('./events')

module.exports = io => {
    io.on('connection', socket => {
        // const ctx = { socket, io }
        // socket.on('event', data => handler(ctx, data))
        // socket.on('disconnect',  => disconnect(io))
        
        socket.on('disconnect', () => {
            redis.incrby('online_users_count', -1, (err, count) => {
                if(err) return 
                io.emit('UPDATE_ONLINE_USERS_COUNT', count)
            })
        })
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
       
        // socket.on('SUBMIT_MESSAGE', data => submit_message(socket, io, data))
        socket.on('SUBMIT_MESSAGE', ({ text }) => {
            if( !text ) return
            // Message
            //     .create({ text })
            //     .then(message => {
            //         io.emit('ADD_MESSAGE', JSON.stringify({
            //             message: message.get()
            //         }))
            //     })
            //    .catch(console.error)
        })
    })    
}