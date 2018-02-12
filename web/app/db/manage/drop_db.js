const db = require('../db')
const { drop } = require('../schema')

if(process.env.NODE_ENV === 'prod'){
    console.error('refusing to drop production DB. Do it manually.')
    process.exit(0)
}
drop(db)
    .then(() => console.log('success: dropped database tables'))
    .catch(e => console.error('error: failed to create database tables', e))
    .finally(() => db.$pool.end())