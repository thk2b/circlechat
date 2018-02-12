const { messages } = require('../../core')

module.exports = function(socket, io, { text }){
    //TODO: validate text -> duck check?
    messages.create(text)
        .then(message => {
            io.emit('ADD_MESSAGE', JSON.stringify(message))
        })
        .catch(e => {
            socket.emit('SUBMIT_MESSAGE_ERROR', e)
        })
}