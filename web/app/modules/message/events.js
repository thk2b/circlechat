const message = require('./service')

const RESOURCE_NAME = '/message'

module.exports = function(socket, io, { meta, data }){
    switch(meta.type){
        case 'POST':
            message.create(socket.userId, data)
            .then(message => {
                io.emit(RESOURCE_NAME, {
                    meta: {...meta, status: 201 },
                    data: { message }
                })
            })
            .catch(e => {
                socket.emit(RESOURCE_NAME, {
                    meta: {...meta, status: e.status || 500},
                    data: e
                })
            })
        case 'PUT':
        case 'DELETE':
        default:
            return
    }
}