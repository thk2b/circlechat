const { messages } = require('../../core')

module.exports = function(socket, io, { text }){
    //TODO: validate text -> duck check?

    const created_at = Date.now()
    
    messages.create()
        .then(({ id }) => {
            io.emit('ADD_MESSAGE', JSON.stringify({
                id,
                text,
                created_at
            }))
        })
        .catch(e => {
            socket.emit('ADD_MESSAGE_FAILURE')
        })
}