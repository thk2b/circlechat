const { Router } = require('express')

const messages = require('./messages')
const ping = require('./ping')

const router = new Router()
router.use('/messages', messages)
router.use('/ping', ping)

module.exports = router