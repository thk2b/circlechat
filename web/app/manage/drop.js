const Promise = require('bluebird')
const modules = require('../modules')

/**
 * Drop all database tables
 */

function drop(){
    const promises = Object.entries(modules).map(
        m => {
            if(typeof m.service.drop === 'function'){
                return m.service.drop()
            }
        }
    )
    return Promise.all(promises)
}

if(require.main === module){
    if(process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === undefined){
        console.error('refusing to drop production DB')
        process.exit(0)
    }
    drop()
    .then(() => console.log('droped database'))
    .catch(e => console.error('failed to drop database: ', e))
}

module.exports = create