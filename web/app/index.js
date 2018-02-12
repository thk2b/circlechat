const config = require('./config')

const server = require('./server')

server.listen(config.port, () => {
    console.log(`app listening on port ${config.port}. NODE_ENV is ${process.env.NODE_ENV}`)
})