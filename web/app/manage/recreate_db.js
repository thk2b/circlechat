const db = require('../db')
const drop = require('../db/drop')
const create = require('../db/create')

drop(db)
    .then(() => create(db))
    .then(() => console.log('success: recreated database tables'))
    .catch(e => console.error('error: failed to recreate database tables', e))
    .finally(() => db.$pool.end())