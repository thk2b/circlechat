const { Router } = require('express')
const message = require('./service')

const r = new Router()

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
    .get((req, res, next) => {})
    .put((req, res, next) => {})
    .delete((req, res, next) => {})

r.route('/all')
    .get((req, res, next) => {})

module.exports = r