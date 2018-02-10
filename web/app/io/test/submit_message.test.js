// const test = require('tape')
// const io = require('socket.io-client')
// const config = require('../../config')

// const server = require('../../index')

// const SOCKET_URL = `http://localhost:${config.port}`
// const options = { forceNew: true }

// let client1, client2

// require('../../test_utils/setup')()

// test('connection event: online users count', t => {
//     const client1 = io.connect(SOCKET_URL)
//     const client2 = io.connect(SOCKET_URL)

//     t.test('submit invalid message', t => {
//         t.ok(false)
//     })

//     t.test('submit valid message', t => {
//         t.plan(3)
//         const payload = {text: 'test'}
//         client2.on('ADD_MESSAGE', data => {
//             client1.disconnect()
//             client2.disconnect()
//             t.equals(data.text, payload.text)
//             t.ok(typeof data.id !== undefined)
//             t.ok(typeof data.sent_at !== undefined)
//             t.end()
//         })
//         client1.emit('SUBMIT_MESSAGE', payload)
//     })
// })