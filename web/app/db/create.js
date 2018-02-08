const db = require('./index')

// export function that creates tables
module.exports = function(){
    db.any(
        `CREATE TABLE message (
            id   SERIAL PRIMARY KEY,
            text VARCHAR(256) NOT NULL,
            created_at VARCHAR(256) NOT NULL
        );`
    ).then(() => console.log('success: created tables'))
    .catch(e => console.error('error: could not create tables: ', e))
}