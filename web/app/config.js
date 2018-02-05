module.exports = {
    port: 8080,
    dbUrl: process.env.DATABASE_URL,
    redis:{
        port: 6379,
        host: 'redis',
        db: 1
    }
}

/*{
    dev:{
        redis: {...},
        postgres: {
            url: process.ENV.DATABASE_URL
        }
    },
    test:{
        redis:{...},
        postgres: {
            url: process.ENV.DATABASE_TEST_URL
        }
    },
    prod:{
        redis: {...},
        postgres: {
            url: process.ENV.DATABASE_URL
        }
    }
}
require('./config')[process.ENV]
*/