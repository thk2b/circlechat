const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const { recreate } = require('../../../manage')
const service = require('../service')

describe('POST /auth event', function(){
    const PORT = 1
    const SOCKET_URL = `http://localhost:${PORT}`
    const credentials = {
        userId: 'iotester',
        email: 'iotester@test.cc',
        pw: 'hunter5'
    }
    let token
    before(function(done){
        recreate()
        .then(() => service.register(credentials))
        .then(() => service.login(credentials))
        .then(data => token = data.token)
        .then(() => server.listen(PORT, e => done(e)))
    })
    after(function(done){
        server.close(e => done(e))
    })

    it('should send an ok message when the token is valid', function(done){
        const client = socketIoClient(SOCKET_URL)
        client.on('/auth', res => {
            expect(res.meta).to.not.be.undefined
            expect(res.meta).to.deep.equal({
                status: 201,
                type: 'POST'
            })
            client.disconnect()
            done()
        })
        client.emit('/auth', {
            meta: { type: 'POST' },
            data: { token }
        })
    })
    it('should send an error when the token is invalid', function(done){
        const client = socketIoClient(SOCKET_URL)
        client.emit('/auth', {
            meta: { type: 'POST' },
            data: { token: '0'+token }
        })
        client.on('/auth', res => {
            expect(res.meta).to.not.be.undefined
            expect(res.meta).to.containSubset({
                status: 401,
                type: 'POST'
            })
            client.disconnect()
            done()
        })
    })
    it('should send an error when the token is not provided', function(done){
        const client = socketIoClient(SOCKET_URL)
        client.emit('/auth', {
            meta: { type: 'POST' },
            data: {  }
        })
        client.on('/auth', res => {
            expect(res.meta).to.not.be.undefined
            expect(res.meta).to.containSubset({
                status: 401,
                type: 'POST'
            })
            client.disconnect()
            done()
        })
    })
})