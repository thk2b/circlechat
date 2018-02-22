const Promise = require('bluebird')
const { Router } = require('express')

const service = require('./service')
const { service: profile } = require('../profile')

const r = new Router()

r.route('/login')
    .post((req, res) => {
        const login = service.login(req.body)
        .then(({ token, userId }) => {
            res.status(201).json({ token, userId })
        })
        .catch(e => { res.status(e.status || 500).json(e) })
    })

r.route('/')
    .post((req, res) => {
        service.register(req.body)
        .then(() => {
            res.status(201).end()
        })
        .catch(e => res.status(e.status || 500).json(e))
    })

r.route('/:id')
    .get((req, res) => {
        service.get(req.userId, req.params.id)
        .then(user => res.status(200).json(user))
        .catch(e => res.status(e.status || 500).json(e))
    })
    .put((req, res) => {
        res.status(500).json({ message: 'implemented' })
    })
    .delete((req, res) =>{
        service.remove(req.userId, req.params.id)
        .then(() => res.status(202).end())
        .catch(e => res.status(e.status || 500).json(e))
    })

module.exports = r