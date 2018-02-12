// const SQL = require('sql-template-strings')
const Promise = require('bluebird')

module.exports = function(db){
    return new Promise((resolve, reject) => {
        db.any(`
        INSERT INTO message (text, created_at)
        VALUES 
            ('test message 1', ${Date.now()}),
            ('test message 2', ${Date.now()}),
            ('test message 3', ${Date.now()})
        RETURNING *;
        `)
        .then(data => resolve(data))
        .catch(e => reject(e))
    })
}