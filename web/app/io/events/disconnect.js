const { user } = require('../../service')

module.exports = function(io, socket, data){
    user.leave()
        .then(newOnlineCount => {
            io.emit('UPDATE_ONLINE_USERS_COUNT', newOnlineCount)
        })
        .catch(e => {
            console.error(e)
        })
}