const { Router } = require('express')

const router = new Router()

router.use('/messages', require('./messages'))
router.use('/ping', require('./ping'))

module.exports = function(app){
    app.use('/api', router)
}