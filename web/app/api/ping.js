const { Router } = require('express')

const router = new Router()

router.route('/')
.get( (req, res) => {
    res.json({
        status: 'success',
        message: 'pong'
    })
})

module.exports = router