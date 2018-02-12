const Promise = require('bluebird')
const SQL = require('sql-template-strings')

const db = require('../db')

module.exports.create = function(text){
    return new Promise((resolve, reject) => {
        if(! text ){
            reject({
                message: 'invalid text'
            })
        }
        const created_at = Date.now()
        db.one(SQL`
            INSERT INTO message (text, created_at)
            VALUES (${text}, ${created_at})
            RETURNING id;
        `).then(({ id})  => {
            resolve({id, text, created_at})
        }).catch(e => {
            console.error(e)
            reject(e)
        })
    })
}