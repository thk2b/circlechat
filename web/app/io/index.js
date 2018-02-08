const redis = require('../redis')
// const { Message } = require('../models')

module.exports = io => {
    io.on('connection', socket => {
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