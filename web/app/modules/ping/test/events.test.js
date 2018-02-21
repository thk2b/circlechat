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
    it('should send a 401 if the client is unauthenticated', function(done){
        const client = socketIoClient(SOCKET_URL)
        client.on('connect', socket => {
            client.emit('/ping')
        })
        client.on('/pong', ({ meta }) => {
            expect(meta.status).to.equal(401)
            client.disconnect()
            done()
        })
    })
    it('should send pong if the client is authenticated', function(done){
        const client = socketIoClient(SOCKET_URL)
        client.on('connect', socket => {
            auth.login(credentials)
            .then(({token}) => {
                client.emit('/auth', {
                    meta: { type: 'POST' },
                    data: { token }
                })
            })
        })
        client.on('/auth', ({ meta, data }) => {
            expect(meta.status).to.equal(201)
            client.emit('/ping')
        })
        client.on('/pong', ({ meta }) => {
            expect(meta.status).to.equal(200)
            client.disconnect()
            done()
        })
    })
})