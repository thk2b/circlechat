const Promise = require('bluebird')

const db = require('../db')

module.exports.get = function(){
    return new Promise((resolve, reject) => {
        db.any('SELECT * FROM message')
            .then(data => resolve(data))
            .catch(e => {
                // do something with the error
                reject(e)
            })
    })
}

module.exports.submit = function(){
    return new Promise((resolve, reject) => {
        db.one(SQL`
            INSERT INTO message (text, created_at)
            VALUES (${text}, ${created_at})
            RETURNING id;
        `).then(data => resolve(data))
            .catch(e => {
                reject(e)
            })
    })
}