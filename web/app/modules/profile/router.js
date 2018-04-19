const { Router } = require('express')

const profile = require('./service')

const r = new Router()

const validateQueryParams = query => {
    if(query.id) return Promise.resolve()
    return Promise.reject({ status: 422, message: 'invalid query parameters'})
}

r.route('/')
    .post((req, res, next) => {
        profile.create(req.userId, req.body)
        .then(profile => {
            res.status(201).json({ profile })
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'POST', status: 201 },
                data: { profile }
            })
        })
        .catch(next)
    })
    .get((req, res, next) => {
        const parseQuery = () => {
            if(req.query.userId) return profile.of.user(req.userId, req.query.userId)
            if(req.query.id) return profile.get(req.userId, req.query.id)
            return Promise.reject({ status: 422, message: 'invalid query parameters'})
        }
        parseQuery()
        .then(profile => res.status(200).json({ profile }))
        .catch(next)
    })
    .put((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => profile.update(req.userId, req.query.id, req.body))
        .then( data => {
            res.status(202).json(data)
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'PUT', status: 202 },
                data
            })
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => profile.remove(req.userId, req.query.id))
        .then(() => {
            res.status(202).end()
            res.locals.socket && res.locals.socket.broadcast.emit('/profile', {
                meta: { type: 'DELETE', status: 202, params: {
                    id: parseInt(req.query.id)
                }}
            })
        })
        .catch(next)
    })

r.route('/all')
    .get((req, res, next) => {
        profile.getAll(req.userId)
        .then(profiles => res.status(200).json({ profiles }))
        .catch(next)
    })

module.exports = r