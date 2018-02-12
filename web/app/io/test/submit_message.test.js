const { expect } = require('chai')
const io = require('socket.io-client')

const server = require('../../server')
const db = require('../../db')
const { create, drop } = require('../../db/schema')

const TEST_PORT = 4
const SOCKET_URL = `http://localhost:${TEST_PORT}`
const options = { forceNew: true }

describe('submit message event', function(){
    before(function(done){
        server.listen(TEST_PORT, () => done())
    })
    beforeEach(function(done){
        drop(db)
            .then(() => create(db))
            .then(() => done())
            .catch(e => done(e))

    })
    after(function(){
        server.close()
    })

    it('should not emit when the message is empty', function(done){
        done(new Error('not implemented'))
    })
    it('should emit when the message is valid, and save the message to the database', function(done){
        const payload = { text: 'hello I am a teapot' }
        const client1 = io.connect(SOCKET_URL, options)
        client1.once('ADD_MESSAGE', message => {
            message = JSON.parse(message)
            expect(message.text).to.equal(payload.text)
            expect(message.created_at).to.exist
            expect(message.id).to.exist
            db.any('SELECT * FROM message')
                .then(([data]) => {
                    data.created_at = +data.created_at // BIGINT are returned as strings
                    expect(data).to.deep.equal(message)
                    done()
                })
                .catch(e => done(e))
        })
        client1.on('connect', () => {
            const client2 = io.connect(SOCKET_URL, options)
            client2.on('connect', () => {
                client2.emit('SUBMIT_MESSAGE', payload)
            })
        })
    })
})