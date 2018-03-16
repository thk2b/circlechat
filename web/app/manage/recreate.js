const create = require('./create')
const drop = require('./drop')

function recreate(){
    return drop().then(() => create())
}

if(require.main === module){
    recreate()
        .then(() => console.log('Recreated database'))
        .catch(e => console.error('Failed to recreate database: ', e))
        .finally(() => process.exit())
}

module.exports = recreate