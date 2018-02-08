const base = {
    port: 8080,
    postgres: {
        url: process.env.DATABASE_URL,
    },
    redis:{
        port: 6379,
        host: 'redis',
        db: 1
    }
}

module.exports = {
    dev: base,
    test: {
        ...base,
        postgres: {
            url: process.env.DATABASE_TEST_URL
        }
    },
    prod: base
}[process.env.NODE_ENV || 'prod']