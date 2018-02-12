const { user } = require('../../service')

module.exports = function(socket, io, data){
    user.join()
        .then(({ onlineCount, connectionCount }) => {
            socket.emit('UPDATE_ONLINE_USERS_COUNT', onlineCount)
            socket.emit('UPDATE_CONNECTIONS_COUNT', connectionCount)
        })
        .catch(({ status, message }) => io.emit('CONNECT_ERROR', { status, message }))
}
