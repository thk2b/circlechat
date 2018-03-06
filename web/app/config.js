const base = {
    port: 8080,
    postgres: {
        url: process.env.DATABASE_URL,
    },
    redis:{
        port: 6379,
        host: 'redis',
        db: 1
    },
    secret: process.env.SECRET
}

module.exports = {
    dev: base,
    test: {
        ...base,
        redis: {
            ...base.redis,
            db: 2
        },
        postgres: {
            url: process.env.DATABASE_TEST_URL
        }
    },
    prod: {
        ...base,
        redis: {
            ...base.redis,
            db: 3
        }
    }
}[process.env.NODE_ENV || 'prod']