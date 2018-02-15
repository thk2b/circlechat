const create = require('./create')
const drop = require('./drop')

drop()
.then(() => create())
.then(() => console.log('Recreated database'))
.catch(e => console.error('Failed to recreate database: ', e))