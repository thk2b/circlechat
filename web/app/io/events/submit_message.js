const SQL = require('sql-template-strings')
const db = require('../../db')

module.exports = function(socket, io, { text }){
    console.log(text)
    const sent_at = Date.now()
    db.one(SQL`
        INSERT INTO messages 
        VALUES (${text}, ${sent_at})
        RETURNING id;
    `).then(id => {
        io.emit('ADD_MESSAGE', JSON.stringify({
            id,
            text,
            sent_at
        }))
    })
    .catch(e => {
        socket.emit('ADD_MESSAGE_FAILURE')
    })
}