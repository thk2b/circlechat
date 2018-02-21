const { Router } = require('express')

const service = require('./service')

const r = new Router()

r.route('/')
    .post((req, res) => {
        service.create(req.userId, req.body)
        .then(profile => res.status(201).json(profile))
        .catch(e => res.status(e.status || 500).json(e))
    })

r.route('/all')
    .get((req, res) => {
        service.getAll(req.userId)
        .then(profiles => res.status(200).json(profiles))
        .catch(e => res.status(e.status || 500).json(e))
    })

r.route('/:id')
    .get((req, res) => {
        service.get(req.userId, req.params.id)
        .then(profile => res.status(200).json(profile))
        .catch(e => res.status(e.status || 500).json(e))
    })
    .put((req, res) => {
        service.update(req.userId, req.params.id, req.body)
        .then( profile => res.status(202).json(profile))
        .catch(e => res.status(e.status || 500).json(e))
    })
    .delete((req, res) => {
        service.remove(req.userId)
        .then(() => res.status(202).end())
        .catch(e => res.status(e.status || 500).json(e))
    })

module.exports = r