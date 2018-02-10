const SQL = require('sql-template-strings')
const db = require('../../db')

module.exports = function(socket, io, { text }){
    const created_at = Date.now()
    db.one(SQL`
        INSERT INTO message (text, created_at)
        VALUES (${text}, ${created_at})
        RETURNING id;
    `).then(({ id }) => {
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