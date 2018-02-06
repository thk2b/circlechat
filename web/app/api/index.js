const { Router } = require('express')

const messages = require('./messages')
const ping = require('./ping')

const router = new Router()
// router.use('/messages', require('./messages'))
router.use('/messages', messages)
// router.use('/ping', require('./ping'))
router.use('/ping', ping)

module.exports = router

// module.exports = function(app){
//     app.use(router)
// }

// module.exports = function(app){
//    app.use('/messages', messages)
//    app.use('/ping', ping)
//}