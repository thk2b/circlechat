const chai = require('chai')
const { expect } = chai
const io = require('socket.io-client')

const server = require('../../server')
const redis = require('../../redis')

const TEST_PORT = 3
const SOCKET_URL = `http://localhost:${TEST_PORT}`
const options = { forceNew: true }

describe('connection event', function(){
    before(function(done){
        server.listen(TEST_PORT, () => {
            done()
        })
    })
    beforeEach(function(){
        redis.flushall()
    })
    after(function(){
        server.close()
    })
    it('should emit `UPDATE_CONNECTIONS_COUNT`', function(done){
        const client1 = io.connect(SOCKET_URL, options)
        client1.on('connect', () => {
            client1.once('UPDATE_CONNECTIONS_COUNT', count => {
                expect(count).to.equal(1)
            })
            const client2 = io.connect(SOCKET_URL, options)
            client2.on('UPDATE_CONNECTIONS_COUNT', count => {
                client1.disconnect()
                client2.disconnect()
                expect(count).to.equal(2)
                done()
            })
        })
    })
    it('should emit `UPDATE_ONLINE_USERS_COUNT`', function(done){
        const client1 = io.connect(SOCKET_URL, options)
        
        client1.once('UPDATE_ONLINE_USERS_COUNT', count => {
            expect(count).to.equal(1)
        })
        client1.on('connect', () => {

            const client2 = io.connect(SOCKET_URL, options)
            client2.once('UPDATE_ONLINE_USERS_COUNT', count => {
                client1.disconnect()
                client2.disconnect()
                expect(count).to.equal(2)

                const client3 = io.connect(SOCKET_URL, options)
                client3.once('UPDATE_ONLINE_USERS_COUNT', count => {
                    expect(count).to.equal(1)
                    done()
                })
            })
        })
    })
})