const test = require('tape')
const io = require('socket.io-client')
const config = require('../../config')

const server = require('../../index')

const SOCKET_URL = `http://localhost:${config.port}`
const options = { forceNew: true }

let client1, client2

require('../../test_utils/setup')()

test('connection event: online users count', t => {
    t.test('online users count', t => {
        t.plan(1)
        const client1 = io.connect(SOCKET_URL, options)
        client1.on('connect', () => {
            const client2 = io.connect(SOCKET_URL, options)
            client2.on('UPDATE_CONNECTIONS_COUNT', count => {
                client1.disconnect()
                client2.disconnect()
                t.equal(count, 2)
                t.end()
            })
        })
    })

    t.test('total connections count', t => {
        t.plan(1)
        const client1 = io.connect(SOCKET_URL, options)
        client1.on('connect', () => {
            
            const client2 = io.connect(SOCKET_URL, options)
            client2.on('connect', () => {
                const counts = []
                client2.on('UPDATE_ONLINE_USERS_COUNT', count => {
                    counts.push(count)
                })
                client1.disconnect()
                setTimeout(() => {
                    t.equal(counts,0)
                    t.end()
                },0)
            })
        })

        client1.disconnect()
    })
    t.end()

    t.test('done', t => t.end())
})