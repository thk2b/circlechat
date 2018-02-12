const { user } = require('../../service')

module.exports = function(socket, io, data){
    user.join()
        .then(({ onlineCount, connectionCount }) => {
            io.emit('UPDATE_ONLINE_USERS_COUNT', onlineCount)
            io.emit('UPDATE_CONNECTIONS_COUNT', connectionCount)
        })
        .catch(({ status, message }) => io.emit('CONNECT_ERROR', { status, message }))
}
