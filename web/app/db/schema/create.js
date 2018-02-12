const Promise = require('bluebird')

module.exports = function(db){
    return new Promise((resolve, reject) => {
        db.any(
            `CREATE TABLE IF NOT EXISTS message (
                id SERIAL,
                text VARCHAR(256) NOT NULL,
                created_at BIGINT NOT NULL,
                PRIMARY KEY (id)
            );`
        ).then(data => resolve(data))   
        .catch(e => reject(e))
    })
}