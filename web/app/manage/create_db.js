const db = require('../db')
const create = require('../db/create')

create(db)
    .then(console.log('success: created database tables'))
    .catch(e => console.error('error: failed top create database tables', e))
    .finally(() => db.$pool.end())