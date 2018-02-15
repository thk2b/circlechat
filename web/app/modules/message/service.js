const db = require('../../db')

module.exports = {
    init: () => new Promise((resolve, reject) => {
        db.any(
            `CREATE TABLE message (
                id SERIAL,
                text VARCHAR(256) NOT NULL,
                created_at BIGINT NOT NULL,
                PRIMARY KEY (id)
            );`
        ).then(data => resolve(data))   
        .catch(e => reject(e))
    }),
    drop: () => new Promise((resolve, reject) => {
        db.none(`DROP TABLE IF EXISTS message`)
        .then(() => resolve())
        .catch(e => reject(e))
    })
}

return new Promise((resolve, reject) => {
   
})