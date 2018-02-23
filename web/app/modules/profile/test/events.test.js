const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const { recreate } = require('../../../manage')
const { service: auth } = require('../../auth')

const service = require('../service')

describe('profile events', function(){
    const PORT = 2
    const SOCKET_URL = `http://localhost:${PORT}`
    let user1 = { userId: 'tester1', email: 'tester1@test.cc', pw: 'hunter6'}
    let user2 = { userId: 'tester2', email: 'tester2@test.cc', pw: 'hunter6'}
    let profile1, profile2
    
    before(function(done){
        recreate()
        .then(() => Promise.all([auth.register(user1), auth.register(user2)]))
        .then(() => Promise.all([
            service.create(user1.userId, { userId: user1.userId }),
            service.create(user2.userId, { userId: user2.userId })
        ])) /* create profile */
        .then(([p1, p2]) => {
            profile1 = p1
            profile2 = p2
        })
        .then(() => server.listen(PORT, () => done()))
        .catch(e => done(e))
    })
    after(function(done){
        server.close(e => done(e))
    })
    describe('connect event', function(){
        it('should set the user\'s status to online and notify clients', function(done){
            auth.login(user1)
            .then(({ token }) => {
                const ws1 = socketIoClient(SOCKET_URL, { query: 'token='+token })
                ws1.once('/profile', ({ meta, data }) => {
                    expect(meta.type).to.equal('PUT')
                    expect(data).to.deep.equal({id: profile1.id, status: 'ONLINE'})
                    ws1.disconnect()
                    done()
                })
            })
        })
    })
    describe('disconnect event', function(){
        it('should set the user\'s status to offline and notify clients', function(done){
            Promise.all([ auth.login(user1), auth.login(user2) ])
            .then(([{ token: t1 }, { token: t2 }]) => {
                const ws1 = socketIoClient(SOCKET_URL, { query: 'token='+t1 })
                ws1.once('/profile', () => { // is now online 
                    const ws2 = socketIoClient(SOCKET_URL, { query: 'token='+t2 })
                    ws2.once('/profile', (p) => { // is now online
                        ws2.once('/profile', ({ meta, data }) => { // user1 is now offline
                            expect(data).to.deep.equal({
                                id: profile1.id, status: 'OFFLINE'
                            })
                            ws2.disconnect()
                            done()
                        })
                        ws1.disconnect()
                    })
                })                
            })
        })
    })
})