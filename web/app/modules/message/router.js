const { Router } = require('express')
const service = require('./service')

const r = new Router()

r.route('/all')
r.route('/:id')



module.exports = r