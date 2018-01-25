const bodyParser = require('body-parser')
const express = require('express')
const io = require('socket.io')
const sequelize = require('sequelize')

const config = require('./config')
const api = require('./api')

const app = express()

app.use('/api', api)
app.route('/api')
.get(() => {
    console.log('req')
})

app.listen(config.port)