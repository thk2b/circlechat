const Promise = require('bluebird')

/**
 * Create all database tables
 */

const modules = require('../modules')

function create(){
    const promises = Object.entries(modules).map(
        ([name, _module]) => {
            if(_module.service.init !== undefined){
                return _module.service.init()
            }
        }
    )
    return Promise.all(promises)
}

if(require.main === module){
    create()
        .then(() => console.log('created database'))
        .catch(e => console.error('failed to create database: ', e))
        .finally(() => process.exit())
}

module.exports = create