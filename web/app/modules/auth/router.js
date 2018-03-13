const Promise = require('bluebird')
const { Router } = require('express')

const service = require('./service')
const { service: profile } = require('../profile')

const r = new Router()

r.route('/login')
    .post((req, res, next) => {
        const login = service.login(req.body)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(next)
    })

r.route('/')
    .post((req, res, next) => {
        service.register(req.body)
        .then(() => {
            res.status(201).end()
        })
        .catch(next)
    })

r.route('/:id')
    .get((req, res, next) => {
        service.get(req.userId, req.params.id)
        .then(user => res.status(200).json(user))
        .catch(next)
    })
    .put((req, res, next) => {
        res.status(500).json({ message: 'implemented' })
    })
    .delete((req, res, next) =>{
        service.remove(req.userId, req.params.id)
        .then(() => res.status(202).end())
        .catch(next)
    })

module.exports = r