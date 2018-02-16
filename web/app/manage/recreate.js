const create = require('./create')
const drop = require('./drop')

function recreate(){
    return drop().then(() => create())
}

if(require.main === module){
    if(process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === undefined){
        console.error('refusing to drop production DB')
        process.exit(0)
    }
    recreate()
        .then(() => console.log('Recreated database'))
        .catch(e => console.error('Failed to recreate database: ', e))
        .finally(() => process.exit())
}

module.exports = recreate