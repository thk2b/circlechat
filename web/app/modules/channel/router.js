const { Router } = require('express')

const channel = require('./service')

const r = new Router()

const validateQueryParams = query => {
    if(query.id) return Promise.resolve()
    return Promise.reject({ status: 422, message: 'invalid query parameters'})
}

r.route('/')
    .post((req, res, next) => {
        channel.create(req.userId, req.body)
        .then(channel => {
            res.status(201).json({ channel })
            res.locals.socket && res.locals.socket.broadcast.emit('/channel', {
                meta: { type: 'POST', status: 201 },
                data: { channel }
            })
        })
        .catch(next)
    })
    .get((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => channel.get(req.userId, req.query.id))
        .then(channel => res.status(200).json({ channel }))
        .catch(next)
    })
    .put((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => channel.update(req.userId, req.query.id, req.body))
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
        .then(() => channel.remove(req.userId, req.query.id))
        .then(() => {
            res.status(202).end()
            res.locals.socket && res.locals.socket.broadcast.emit('/channel', {
                meta: { type: 'DELETE', status: 202, params: {
                    id: parseInt(req.query.id)
                }}
            })
        })
        .catch(next)
    })

r.route('/all')
    .get((req, res, next) => {
        channel.getAll(req.userId)
        .then( channels => res.status(200).json(channels))
        .catch(next)
    })

module.exports = r