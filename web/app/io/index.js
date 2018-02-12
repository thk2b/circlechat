const Promise = require('bluebird')
const socketIo = require('socket.io')

const events = require('./events')
const { user } = require('../service')


module.exports = function(server){
    const io = socketIo(server)
    io.on('connection', socket => {
        /* attach event handlers to their respective event names */
        Object.entries(events).forEach(
            ([event, handler]) => {
                socket.on(event, data => handler(socket, io, data))
            }
        )
        events['connection'](socket, io)
    })
}