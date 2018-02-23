const service = require('./service')

const RESOURCE_NAME = '/profile'

module.exports = function(socket, io, { meta, data }={}){
    switch(meta.type){
        case 'connect':
            return service.setUserStatus(socket.userId, socket.userId, 'ONLINE')
            .then(profile => {
                io.emit(RESOURCE_NAME, { 
                    meta: { type: 'PUT', status: 201 },
                    data: { profile }
                })
            })
            .catch(e => {
                socket.emit(RESOURCE_NAME, {
                    meta: { type: 'PUT', status: e.status || 500 },
                    data: { message: 'could not set status', e}
                })
            })
        case 'disconnect':
            console.log(0, 'disc')
            return service.setUserStatus(socket.userId, socket.userId, 'OFFLINE')
            .then(profile => {
                io.emit(RESOURCE_NAME, { 
                    meta: { type: 'PUT', status: 201 },
                    data: { profile }
                })
            })
            .catch(e => {
                socket.emit(RESOURCE_NAME, {
                    meta: { type: 'PUT', status: e.status || 500 },
                    data: { message: 'could not set status', e}
                })
            })
        case 'PUT':
        default:
            return
    }
}