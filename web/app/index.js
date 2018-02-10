const server = require('./server')

const config = require('./config')
console.log('aa')
server.listen(config.port, () => {
    console.log(`app listening on port ${config.port}. NODE_ENV is ${process.env.NODE_ENV}`)
})