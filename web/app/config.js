module.exports = {
    port: 8080,
    dbUrl: process.env.DATABASE_URL,
    redis:{
        port: 6379,
        host: 'redis',
        db: 1
    }
}