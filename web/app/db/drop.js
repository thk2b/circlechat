const db = require('./index')

module.exports = function(){
    db.any(`DROP TABLE message`)
        .then(() => console.log('success: dropped tables'))
        .catch(e => console.error('error: could not drop tables: ', e))
}