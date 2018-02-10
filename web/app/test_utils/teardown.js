const test = require('tape')

const server = require('../index')

test.onFinish(() => {
    server.close()
})