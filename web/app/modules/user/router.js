const { Router } = require('express')
const service = require('./service')

const r = new Router()

r.route('/login')
    .post((req, res) => {

    })

r.route('/register')
    .post((req, res) => {

    })

r.route('/')
    .get((req, res) => {})
    .put((req, res) => {})
    .delete((req, res) => {})

r.route('/all')
    .get((req, res) => {
        service.all()
        .then(users => {
            res.json(users)
        })
        .catch(e => {
            res.status(e.status)
            res.json(e)
        })
    })



module.exports = r