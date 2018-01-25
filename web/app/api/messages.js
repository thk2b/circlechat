const { Router } = require('express')
const { Message } = require('../models')

const router = new Router()

router.route('/')
.get((req, res) => {
    Message
        .findAll()
        .then(messages => {
            res.json({ messages })
        })
        .catch(
            e => console.error(e)
        )
})

module.exports = router