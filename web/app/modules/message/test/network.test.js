const chai = require('chai')
const { expect } = chai

const request = require('supertest')
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const db = require('../../../db')
const { recreate } = require('../../../manage')
const { auth, profile, channel, message } = require('../../../modules')

const profileService = profile.service

const service = require('../service')

const PORT = 2
const SOCKET_URL = `http://localhost:${PORT}`
const API_URL = '/api/v1/message'

describe('message network', function(){
    const credentials1= {
        userId: 'test1', 
        email: 'test1@test.cc', 
        pw: 'hunter2'
    }
    const credentials2 = {
        userId: 'test2', 
        email: 'test2@test.cc', 
        pw: 'hunter2'
    }
    let token1
    let token2

    let profile1
    let profile2

    let channel1
    let channel2

    let socket1
    let socket2

    let message1
    let message2

    before(function(done){
        /* Create 2 accounts, login, create profiles and channels */
        recreate()
        .then(() => Promise.all([
            auth.service.register(credentials1),
            auth.service.register(credentials2)
        ]))
        .then(() => Promise.all([
            profile.service.create(credentials1.userId, { userId: credentials1.userId }),
            profile.service.create(credentials2.userId, { userId: credentials2.userId })
        ]))
        .then(([p1, p2]) => {
            profile1 = p1
            profile2 = p2
            return [p1, p2]
        })
        .then(([p1, p2]) => Promise.all([
            channel.service.create(credentials1.userId, { profileId: p1.id, name: 'test channel 1'}),
            channel.service.create(credentials2.userId, { profileId: p2.id, name: 'test channel 2'})
        ]))
        .then(([c1, c2]) => {
            channel1 = c1
            channel2 = c2
            
            /* prepare messages */
            message1 = { profileId: profile1.id, channelId: channel1.id, text: 'test message 1' }
            message2 = { profileId: profile1.id, channelId: channel1.id, text: 'test message 2' }
            message3 = { profileId: profile1.id, channelId: channel2.id, text: 'test message 3' }
            message4 = { profileId: profile1.id, channelId: channel2.id, text: 'test message 4' }
        })
        .then(() => Promise.all([
            auth.service.login(credentials1),
            auth.service.login(credentials2)
        ]))
        .then(([t1, t2]) => {
            token1 = t1.token
            token2 = t2.token
        })
        .then(() => server.listen(PORT, e => e? Promise.reject(e): Promise.resolve()))
        .then(() => {
            socket1 = socketIoClient(SOCKET_URL, { query: 'token='+token1 })
            socket1.once('connect', () => {
                socket2 = socketIoClient(SOCKET_URL, { query: 'token='+token2 })
                socket2.once('connect', () => done())
            })
        })
        .catch(e => done(e))
    })
    after(function(done){
        server.close(e => done(e))
    })
    describe(`POST ${API_URL}`, function(){
        it('should not create a message when unauthenticated', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer no' + token1)
                .send(message1)
                .expect(401)
                .end(done)
        })
        it('should not create a message for another user', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token2)
                .send(message1)
                .expect(403)
                .end(done)
        })
        it('should not create a message when data is invalid', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token1)
                .send({ wrong: 'key' })
                .expect(422)
                .end(done)
        })
        it('should create a message when authorized and authenticated and notify websocket clients', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token1)
                .send(message1)
                .expect(201)
                .end((e, res) => {
                    if(e) return done(e)
                    message1 = res.body.message
                    done()
                })
        })
        it('should notify websocket clients', function(done){
            socket2.once('/message', ({ meta, data }) => {
                expect(meta.status).to.equal(201)
                expect(meta.type).to.equal('POST')
                expect(data.message.name).to.equal(message1.name)
                done()
            })
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token1)
                .send(message2)
                .end((e, res) => {
                    if(e) done(e)
                    message2 = res.body.message
                })
        })
    })
    describe('websocket message/', function(done){
        it('should not create a message for another user', function(done){
            socket2.once('/message', ({ meta, data }) => {
                expect(meta.status).to.equal(403)
                done()
            })
            socket2.emit('/message', { meta: { type: 'POST' }, data: message3})
        })
        it('should not create a message when data is invalid', function(done){
            socket1.once('/message', ({ meta, data }) => {
                expect(meta.status).to.equal(422)
                done()
            })
            socket1.emit('/message', { meta: { type: 'POST' }, data: {wrong: 'key'}})
        })
        it('should create a message when authorized and authenticated and notify websocket clients', function(done){
            socket1.once('/message', ({ meta, data }) => {
                expect(meta.status).to.equal(201)
                expect(meta.type).to.equal('POST')
                expect(data.message.text).to.equal(message3.text)
                message3 = data.message
                done()
            })
            socket1.emit('/message', { meta: { type: 'POST' }, data: message3})
        })
        it('should notify websocket clients', function(done){
            socket2.once('/message', ({ meta, data }) => {
                expect(meta.status).to.equal(201)
                expect(meta.type).to.equal('POST')
                expect(data.message.name).to.equal(message4.name)
                message4 = data.message
                done()
            })
            socket1.emit('/message', { meta: { type: 'POST' }, data: message4})
        })
    })
})