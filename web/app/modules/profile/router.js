const { Router } = require('express')

const service = require('./service')

const r = new Router()

r.route('/')
    .post((req, res) => {
        service.create(req.userId, req.body)
        .then(profile => res.status(201).json(profile))
        .catch(e => res.status(e.status || 500).json(e))
    })

r.route('/:id')
    .get((req, res) => {
        service.get(req.userId, req.params.id)
        .then(profile => res.status(200).json(profile))
        .catch(e => res.status(e.status || 500).json(e))
    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

r.route('/all')
    .get((req, res) => {

    })

module.exports = r