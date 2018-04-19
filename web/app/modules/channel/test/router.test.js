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
                expect(meta.type).to.equal('POST')
                expect(data.channel.name).to.equal(channel1.name)
                done()
            })
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token1)
                .send(channel1)
                .end((e, res) => {
                    if(e) done(e)
                    channel1 = res.body.channel
                })
        })
    })
    describe(`GET ${API_URL}`, function(){
        it('should send a 422 when invalid query params are sent', function(done){
            request(server)
                .get(API_URL)
                .query({wrong: 123})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(422)
                .end(done)
        })
        it('should not send a channel that does not exist', function(done){
            request(server)
                .get(API_URL)
                .query({id: 123})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end(done)
        })
        it('should send a channel when authorized and authenticated', function(done){
            request(server)
                .get(API_URL)
                .query({ id: channel.id })
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.channel).to.deep.equal(channel)
                    done()
                })
        })
        describe(`GET ${API_URL}/all`, function(){
            it('should not send all channels when unauthenticated', function(done){
                request(server)
                    .get(API_URL + '/all')
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .end(done)
            })
            it('should not send all channels with an invalid token', function(done){
                request(server)
                    .get(API_URL + '/all')
                    .set('Authorization', 'Bearer 0' + token)
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .end(done)
            })
            it('should send all channels when authorized and authenticated', function(done){
                request(server)
                    .get(API_URL + '/all')
                    .set('Authorization', 'Bearer ' + token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end((e, res) => {
                        if(e) return done(e)
                        expect(res.body.channels[channel.id]).to.not.be.undefined
                        expect(res.body.channels[channel1.id]).to.not.be.undefined
                        done()
                    })
            })
        })
    })
    describe(`PUT ${API_URL}`, function(){
        it('should not update a channel when unauthenticated', function(done){
            request(server)
                .put(API_URL)
                .query({ id: channel.id })
                .send({ name: 'new name' })
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not update a channel with an invalid token', function(done){
            request(server)
                .put(API_URL)
                .query({ id: channel.id })
                .send({ name: 'new name' })
                .set('Authorization', 'Bearer 0' + token)
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not update a channel created by another user', function(done){
            request(server)
                .put(API_URL)
                .query({ id: channel1.id })
                .send({ name: 'new name' })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(403)
                .end(done)
        })
        it('should not update a channel when data is invalid', function(done){
            request(server)
                .put(API_URL)
                .query({ id: channel.id })
                .send({ wrong: 'key' })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(422)
                .end(done)
        })
        it('should update a channel when authorized and authenticated', function(done){
            request(server)
                .put(API_URL)
                .query({ id: channel.id })
                .send({ name: 'new name' })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(202)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.id).to.not.be.undefined
                    expect(res.body.updatedAt).to.not.be.undefined
                    expect(res.body.name).to.equal('new name')
                    channel = {...channel, ...res.body}
                    done()
                })
        })
        it('should notify websocket clients', function(done){
            socket.once('/profile', ({ meta, data }) => {
                expect(meta).to.deep.equal({
                    status: 202, type: 'PUT'
                })
                expect(data.name).to.equal('new name1')
                done()
            })
            request(server)
                .put(API_URL)
                .query({ id: channel1.id })
                .send({ name: 'new name1' })
                .set('Authorization', 'Bearer ' + token1)
                .set('Content-Type', 'application/json')
                .expect(202)
                .end((e, res) => {
                    if(e) return done(e)
                    channel1 = {...channel1, ...res.body}
                })
        })
    })
    describe(`DELETE ${API_URL}`, function(){
        it('should not delete a channel when unauthenticated', function(done){
            request(server)
                .delete(API_URL)
                .query({ id: channel.id })
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not delete a channel created by another user', function(done){
            request(server)
                .delete(API_URL)
                .query({ id: channel1.id })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(403)
                .end(done)
        })
        it('should delete a channel when authorized and authenticated', function(done){
            request(server)
                .delete(API_URL)
                .query({ id: channel.id })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(202)
                .end(done)
        })
        it('should notify websocket clients', function(done){
            socket.once('/channel', ({ meta }) => {
                expect(meta).to.deep.equal({
                    status: 202, type: 'DELETE',
                    params: { id: channel1.id }
                })
                done()
            })
            request(server)
                .delete(API_URL)
                .query({ id: channel1.id })
                .set('Authorization', 'Bearer ' + token1)
                .set('Content-Type', 'application/json')
                .expect(202)
                .end(e => e&&done(e))
        })
    })
})