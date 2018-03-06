const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const request = require('supertest')
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const db = require('../../../db')
const { recreate } = require('../../../manage')
const { auth, profile } = require('../../../modules')

const profileService = profile.service

const service = require('../service')


const PORT = 1
const SOCKET_URL = `http://localhost:${PORT}`
const API_URL = '/api/v1/channel'

describe(API_URL, function(){
    const credentials = {
        userId: 'tester', 
        email: 'test@test.cc', 
        pw: 'hunter2'
    }
    const credentials1 = {
        userId: 'tester1', 
        email: 'test1@test.cc', 
        pw: 'hunter2'
    }
    let token
    let token1

    let profile
    let profile1

    let channel = { name: 'test channel' }
    let channel1 = { name: 'test channel1' }

    let socket
    let socket1

    before(function(done){
        /* Create 2 accounts, login and create profiles */
        recreate()
        .then(() => Promise.all([
            auth.service.register(credentials)
            .then(() => auth.service.login(credentials))
            .then(data => token = data.token)
            .then(() => profileService.create(credentials.userId, {userId: credentials.userId}))
            .then(p => {
                profile = p
                channel.profileId = p.id
            }),

            auth.service.register(credentials1)
            .then(() => auth.service.login(credentials1))
            .then(data => token1 = data.token)
            .then(() => profileService.create(credentials1.userId, {userId: credentials1.userId}))
            .then(p => {
                profile1 = p
                channel1.profileId = p.id
            })
        ]))
        .then(() => server.listen(PORT, e => e? Promise.reject(e): Promise.resolve()))
        .then(() => {
            socket = socketIoClient(SOCKET_URL, { query: 'token='+token })
            socket.once('connect', () => {
                socket1 = socketIoClient(SOCKET_URL, { query: 'token='+token1 })
                socket1.once('connect', () => done())
            })
        })
        .catch(e => done(e))
    })

    after(function(done){
        server.close(e => done(e))
    })

    describe(`POST ${API_URL}`, function(){
        it('should not create a channel when unauthenticated', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer no' + token)
                .send(channel)
                .expect(401)
                .end(done)
        })
        it('should not create a channel for another user', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token1)
                .send(channel)
                .expect(403)
                .end(done)
        })
        it('should not create a channel when data is invalid', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send({ wrong: 'key' })
                .expect(422)
                .end(done)
        })
        it('should create a channel when authorized and authenticated and notify websocket clients', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send(channel)
                .expect(201)
                .end((e, res) => {
                    if(e) return done(e)
                    channel = res.body.channel
                    done()
                })
        })
        it('should not create a channel when the name is already taken', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send(channel)
                .expect(409)
                .end(done)
        })
        it('should notify websocket clients', function(done){
            socket.once('/channel', ({ meta, data }) => {
                expect(meta.status).to.equal(201)
                expect(data.channel.name).to.equal(channel1.name)
                done()
            })
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token1)
                .send(channel1)
                .end(e => {
                    if(e) done(e)
                })
        })
    })
    describe(`GET ${API_URL}`, function(){})
    describe(`GET ${API_URL}/all`, function(){})
    describe(`PUT ${API_URL}`, function(){})
    describe(`DELETE ${API_URL}`, function(){})
})