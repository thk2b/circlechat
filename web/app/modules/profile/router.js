const { Router } = require('express')

const service = require('./service')

const r = new Router()

const validateQueryParams = query => {
    if(query.id) return Promise.resolve()
    return Promise.reject({ status: 422, message: 'invalid query parameters'})
}

r.route('/')
    .post((req, res) => {
        service.create(req.userId, req.body)
        .then(profile => {
            res.status(201).json(profile)
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'POST', status: 201 },
                data: { profile }
            })
        })
        .catch(e => res.status(e.status || 500).json(e))
    })
    .get((req, res) => {
        const parseQuery = () => {
            if(req.query.userId) return service.of.user(req.userId, req.query.userId)
            if(req.query.id) return service.get(req.userId, req.query.id)
            return Promise.reject({ status: 422, message: 'invalid query parameters'})
        }
        parseQuery()
        .then(profile => res.status(200).json(profile))
        .catch(e => res.status(e.status || 500).json(e))
    })
    .put((req, res) => {
        validateQueryParams(req.query)
        .then(() => service.update(req.userId, req.query.id, req.body))
        .then( profile => {
            res.status(202).json(profile)
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'PUT', status: 202 },
                data: { profile }
            })
        })
        .catch(e => res.status(e.status || 500).json(e))
    })
    .delete((req, res) => {
        validateQueryParams(req.query)
        .then(() => service.remove(req.userId, req.query.id))
        .then(() => {
            res.status(202).end()
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'DELETE', status: 202 }
            })
        })
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
        .then( profile => {
            res.status(202).json(profile)
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'PUT', status: 202 },
                data: { profile }
            })
        })
        .catch(e => res.status(e.status || 500).json(e))
    })
    .delete((req, res) => {
        service.remove(req.userId, req.params.id)
        .then(() => {
            res.status(202).end()
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'DELETE', status: 202 }
            })
        })
        .catch(e => res.status(e.status || 500).json(e))
    })

module.exports = r