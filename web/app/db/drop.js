const Promise = require('bluebird')

module.exports = function(db){
    return new Promise((resolve, reject) => {
        db.any(`DROP TABLE message`)
        .then(data => resolve(data))
        .catch(e => reject(e))
    })
}