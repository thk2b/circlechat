const validateSocketIoRequest = require('../../lib/validateSocketIoRequest')
const service = require('./service')


module.exports = function(socket, io, { meta, data}){
    validateSocketIoRequest({ meta, data })
    .then(() => service.verifyToken(data.token))
    .then(userId => {
        socket.userId = userId
        socket.emit('/auth', {
            meta: { ...meta, status: 201 }
        })
    })
    .catch(e => {
        socket.userId = null
        socket.emit('/auth', {
            meta: { ...meta, status: e.status },
            data: e
        })
    })
}