const db = require('../db')
const seed = require('../db/seed')

seed(db)
    .then((data) => {
        console.log(data)
        console.log('success: seeded database')
    })
    .catch(e => console.error('error: could not seed database: ', e))