const Promise = require('bluebird')

const { auth, profile, channel, message } = require('../modules')
/** 
 * Drop all database tables one after the other.
*/
function drop(){
    return message.service.drop()
    .then(() => channel.service.drop())
    .then(() => profile.service.drop())
    .then(() => auth.service.drop())
}

if(require.main === module){
    if(process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === undefined){
        console.error('refusing to drop production DB')
        process.exit(0)
    }
    drop()
        .then(() => console.log('droped database'))
        .catch(e => console.error('failed to drop database: ', e))
        .finally(() => process.exit())
}

module.exports = drop