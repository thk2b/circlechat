const Promise = require('bluebird')

const { auth, profile } = require('../modules')
/** 
 * init all database tables one after the other.
*/
function create(){
    return auth.service.init()
    .then(() => profile.service.init())
}

if(require.main === module){
    create()
        .then(() => console.log('created database'))
        .catch(e => console.error('failed to create database: ', e))
        .finally(() => process.exit())
}

module.exports = create