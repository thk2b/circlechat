const { Router } = require('express')

const validate = require('../../lib/validate')

const message = require('./service')

const r = new Router()

const validateQueryParams = query => {
    if(query.id) return Promise.resolve()
    return Promise.reject({ status: 422, message: 'invalid query parameters'})
}

r.route('/')
    .post((req, res, next) => {
        message.create(req.userId, req.body)
        .then(message => {
            res.status(201).json({ message })
            res.locals.socket && res.locals.socket.broadcast.emit('/message', {
                meta: { type: 'POST', status: 201 },
                data: { message }
            })
        })
        .catch(next)
    })
    .get((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => message.get(req.userId, req.query.id))
        .then( message => res.status(200).json({ message }))
        .catch(next)

    })
    .put((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => message.update(req.userId, req.query.id, req.body))
        .then( data => {
            res.status(202).json(data)
            res.locals.socket && res.locals.socket.broadcast.emit('/message', {
                meta: { type: 'PUT', status: 202 },
                data
            })
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        validateQueryParams(req.query)
        .then(() => message.remove(req.userId, req.query.id))
        .then( data => {
            res.status(202).json(data)
            res.locals.socket && res.locals.socket.broadcast.emit('/message', {
                meta: { type: 'DELETE', status: 202 },
                data
            })
        })
        .catch(next)
    })

r.route('/all')
    .get((req, res, next) => {
        validate(req.query.channelId)
        .then(() => message.inChannel(req.userId, req.query.channelId, req.query.n, req.query.after))
        .then(messages => res.status(200).json(messages))
        .catch(next)
    })

module.exports = r