const Promise = require('bluebird')

/**
 * Create all database tables
 */

const modules = require('../modules')

function create(){
    const promises = Object.entries(modules).map(
        m => {
            if(typeof m.service.init === 'function'){
                return m.service.init()
            }
        }
    )
    return Promise.all(promises)
}

if(require.main === module){
    create()
    .then(() => console.log('created database'))
    .catch(e => console.error('failed to create database: ', e))
}

module.exports = create