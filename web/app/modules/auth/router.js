const { Router } = require('express')

const service = require('./service')

const r = new Router()

r.route('/login')
.post((req, res) => {

})

r.route('/')
.post((req, res) => {
    service.register(req.body)
    .then(data => {
        res.status(201)
        res.json(data)
    })
    .catch(e => {
        res.status(e.code || 500)
        res.json(e)
    })
})

r.route('/:id')
.get((req, res) => {

})
.put((req, res) => {

})
.delete((req, res) =>{

})

module.exports = r