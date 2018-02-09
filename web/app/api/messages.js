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
            console.error('error in route `messages`: ', e)
            res.status(501)
            res.json({
                message: 'Internal database error'
            })
        })
})

module.exports = router