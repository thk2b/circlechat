const redis = require('../../redis')

module.exports = function(io, socket, data){
    redis.incrby('online_users_count', -1, (err, count) => {
        if(err) return 
        io.emit('UPDATE_ONLINE_USERS_COUNT', count)
    })
}