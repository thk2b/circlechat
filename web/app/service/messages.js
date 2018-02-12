const Promise = require('bluebird')

const db = require('../db')

module.exports.get = function(){
    return new Promise((resolve, reject) => {
        db.any('SELECT * FROM message')
            .then(data => resolve(data))
            .catch(e => {
                console.error(e)
                reject(e)
            })
    })
}