const { message } = require('../../service')

module.exports = function(socket, io, { text }){
    message.create(text)
        .then(message => {
            io.emit('ADD_MESSAGE', JSON.stringify(message))
        })
        .catch(e => {
            socket.emit('SUBMIT_MESSAGE_ERROR', e)
        })
}