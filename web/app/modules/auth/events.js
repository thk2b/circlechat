const service = require('./service')

module.exports = function(socket, io, { meta, data }){
    switch(meta.type){
        case 'disconnect': 
            service.logout(socket.userId, socket.userId)
        default: return
    }
}