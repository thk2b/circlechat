const { Router } = require('express')

const channel = require('./service')

const r = new Router()

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
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

r.route('/all')
    .get((req, res) => {

    })

module.exports = r