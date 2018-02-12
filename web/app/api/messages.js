const { Router } = require('express')
const router = new Router()

const { messages } = require('../service')
router.route('/')
    .get((req, res) => {
        messages.get()
            .then(messages => res.json(messages))
            .catch(({ status, message }) => {
                res.status(status || 500)
                res.json(message)
            })
    })

module.exports = router