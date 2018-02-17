const { Router } = require('express')

const service = require('./service')

const r = new Router()

r.route('/login')
    .post((req, res) => {
        service.login(req.body)
        .then(token => res.status(201).json({ token }))
        .catch(e => res.status(e.code || 500).json(e))
    })

r.route('/')
    .post((req, res) => {
        service.register(req.body)
        .then(data => res.status(201).json(data))
        .catch(e => res.status(e.code || 500).json(e))
    })

r.route('/:id')
    .get((req, res) => {
        service.get(req.userId, req.params.id)
        .then(user => res.status(200).json(user))
        .catch(e => res.status(e.code || 500).json(e))
    })
    .put((req, res) => {

    })
    .delete((req, res) =>{
        service.remove(req.userId, req.params.id)
        .then(() => res.status(202).end())
        .catch(e => res.status(e.code || 500).json(e))
    })

module.exports = r