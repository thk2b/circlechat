const db = require('../')
const { create, drop } = require('../schema')

drop(db)
    .then(() => create(db))
    .then(() => console.log('success: recreated database tables'))
    .catch(e => console.error('error: failed to recreate database tables', e))
    .finally(() => db.$pool.end())