const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const { recreate } = require('../../../manage')

const { service: auth } = require('../../auth')

describe('POST /ping event', function(){
    const PORT = 2
    const SOCKET_URL = `http://localhost:${PORT}`
    const credentials = {
        userId: 'iotester',
        email: 'iotester@test.cc',
        pw: 'hunter5'
    }
    let token
    before(function(done){
        recreate()
        .then(() => auth.register(credentials))
        .then(() => server.listen(PORT, e => done(e)))
    })
    after(function(done){
        server.close(e => done(e))
    })
    it.skip('should send a 401 if the client is unauthenticated', function(done){
        /* if this test times out, then it passes. curently cannot send 'unauthorized' from middleware */
        const client = socketIoClient(SOCKET_URL)
        client.on('connect', socket => {
            done(new Error('should be unauthorized'))
        })
        client.on('unauthorized', (message) => {
            expect(message).to.equal('invalid token')
        })
    })
    it('should send pong if the client is authenticated', function(done){
        let client
        auth.login(credentials)
        .then(({token}) => {
            client = socketIoClient(SOCKET_URL, {
                extraHeaders: {
                    Authorization: 'Bearer '+token
                }
            })
            client.on('connect', () => {
                client.emit('/ping')
            })
            client.on('/pong', ({ meta }) => {
                expect(meta.status).to.equal(200)
                client.disconnect()
                done()
            })
        })
    })
})