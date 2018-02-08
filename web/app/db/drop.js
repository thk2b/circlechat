const db = require('./index')

module.exports = function(closeDb){
    db.any(`DROP TABLE message`)
        .then(() => console.log('success: dropped tables'))
        .catch(e => console.error('error: could not drop tables: ', e))
        .finally(() => closeDb && db.$pool.end()) 
}