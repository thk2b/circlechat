const { Router } = require('express')
const db = require('../db')

const router = new Router()

router.route('/')
.get((req, res) => {
    db.any('SELECT * FROM message')
        .then( data => {
            res.json(data)
        })
        .catch( e => {

        })
    // Message
    //     .findAll()
    //     .then(messages => {
    //         res.json({ messages })
    //     })
    //     .catch(
    //         e => console.error(e)
    //     )
})

module.exports = router