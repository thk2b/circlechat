const service = require('./service')

const RESOURCE_NAME = '/profile'

module.exports = function(socket, io, { meta, data }={}){
    switch(meta.type){
        case 'connect':
            return service.setUserStatus(socket.userId, socket.userId, 'ONLINE')
            .then(data => {
                io.emit(RESOURCE_NAME, { 
                    meta: { type: 'PUT', status: 201 },
                    data
                })
            })
            .catch(e => {
                if(e.status === 404) return /* the user's profile does not exist yet. no need to notify since it will get created shortly */
                socket.emit(RESOURCE_NAME, {
                    meta: { type: 'PUT', status: e.status || 500 },
                    data: { message: 'profile not found: could not set status', e}
                })
            })
        case 'disconnect':
            return service.setUserStatus(socket.userId, socket.userId, 'OFFLINE')
            .then(data => {
                io.emit(RESOURCE_NAME, { 
                    meta: { type: 'PUT', status: 201 },
                    data
                })
            })
            .catch(e => {
                socket.emit(RESOURCE_NAME, {
                    meta: { type: 'PUT', status: e.status || 500 },
                    data: { message: 'profile not found: could not set status', e}
                })
            })
        default:
            return
    }
}