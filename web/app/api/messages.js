const { Router } = require('express')
const router = new Router()

const { messages } = require('../core')
router.route('/')
    .get((req, res) => {
        messages.get()
            .then(res.json)
            .catch(({ e }) => {
                res.status(e.status || 500)
                res.json(e.message)
            })
    })

module.exports = router