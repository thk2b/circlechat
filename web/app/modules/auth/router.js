const Promise = require('bluebird')
const { Router } = require('express')

const service = require('./service')
const { service: profile } = require('../profile')

const r = new Router()

r.route('/login')
    .post((req, res) => {
        const login = service.login(req.body)
        const _profile = login.then(({ token, userId }) => profile.of.user(userId, userId))

        Promise.all([login, _profile])
        .then(([{ token, userId }, profile ]) => {
            res.status(201).json({ token, userId, profile })
        })
        .catch(e => { res.status(e.status || 500).json(e) })
    })

r.route('/')
    .post((req, res) => {
        service.register(req.body)
        .then(data => res.status(201).json(data))
        .catch(e => res.status(e.status || 500).json(e))
    })

r.route('/:id')
    .get((req, res) => {
        service.get(req.userId, req.params.id)
        .then(user => res.status(200).json(user))
        .catch(e => res.status(e.status || 500).json(e))
    })
    .put((req, res) => {

    })
    .delete((req, res) =>{
        service.remove(req.userId, req.params.id)
        .then(() => res.status(202).end())
        .catch(e => res.status(e.status || 500).json(e))
    })

module.exports = r