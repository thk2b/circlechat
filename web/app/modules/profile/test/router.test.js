const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const request = require('supertest')
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const db = require('../../../db')
const { recreate } = require('../../../manage')
const service = require('../service')

const { auth } = require('../../../modules')

const PORT = 1
const SOCKET_URL = `http://localhost:${PORT}`
const API_URL = '/api/v1/profile'

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
    let token = undefined
    const profile = {
        userId: 'tester'
    }
    const profile1 = {
        userId: 'tester1',
        description: 'testing and stuff',
        status: 'INVISIBLE'
    }
    let savedProfile /* the profiles returned by the server, containing their id */
    let savedProfile1

    before(function(done){
        recreate()
        .then(() => auth.service.register(credentials))
        .then(() => auth.service.login(credentials))
        .then(data => token = data.token)
        .then(() => auth.service.register(credentials1))
        .then(() => server.listen(PORT, () => done()))
        .catch(e => done(e))
    })
    after(function(done){
        server.close(e => done(e))
    })
    describe(`POST ${API_URL}`, function(){
        it('should not create a profile when unauthenticated', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer no' + token)
                .send(profile)
                .expect(401)
                .end(done)
        })
        it('should not create a profile for another user', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send({ ...profile, userId: credentials1.userId })
                .expect(403)
                .end(done)
        })
        it('should not create a profile when data is invalid', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send({ wrong: 'key' })
                .expect(422)
                .end(done)
        })
        it('should create a profile when authorized and authenticated', function(done){
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send(profile)
                .expect(201)
                .end((e, res) => {
                    if(e) return done(e)
                    savedProfile = res.body.profile
                    done()
                })
        })
    })
    describe(`GET ${API_URL}`, function(){
        before(function(){
            return service.create(credentials1.userId, profile1)
            .then(profile => savedProfile1 = profile)
        })
        it('should send a 422 when invalid query params are sent', function(done){
            request(server)
                .get(API_URL)
                .query({wrong: 123})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(422)
                .end(done)
        })
        it('should not send a profile that does not exist', function(done){
            request(server)
                .get(API_URL)
                .query({id: 123})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end(done)
        })
        it('should send a profile when authorized and authenticated', function(done){
            request(server)
                .get(API_URL)
                .query({ id: savedProfile.id })
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.profile.id).to.not.be.undefined
                    expect(res.body.profile).to.containSubset(savedProfile)
                    done()
                })
        })
        it('should send a profile when requesting a different user\'s profile', function(done){
            request(server)
                .get(API_URL)
                .query({ id:savedProfile1.id })
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.profile.id).to.not.be.undefined
                    expect(res.body.profile).to.containSubset(savedProfile1)
                    done()
                })
        })
        it('should send a profile when unauthenticated', function(done){
            request(server)
                .get(API_URL)
                .query({ id: savedProfile.id })
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.profile.id).to.not.be.undefined
                    expect(res.body.profile).to.containSubset(savedProfile)
                    done()
                })
        })
        it('should not send a user\'s own profile when specified in the query and unauthenticated', function(done){
            request(server)
                .get(API_URL)
                .query({ userId: savedProfile.userId })
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not send another user\'s profile when specified in the query', function(done){
            request(server)
                .get(API_URL)
                .query({ userId: savedProfile1.userId })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(403)
                .end(done)
        })
        it('should send a user\'s own profile when specified in the query and authenticated', function(done){
            request(server)
                .get(API_URL)
                .query({ userId: savedProfile.userId })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.profile.id).to.not.be.undefined
                    expect(res.body.profile).to.containSubset(savedProfile)
                    done()
                })
        })
    })
    describe(`GET ${API_URL}/all`, function(){
        it('should not send all profiles when unauthenticated', function(done){
            request(server)
                .get(API_URL + '/all')
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not send all profiles with an invalid token', function(done){
            request(server)
                .get(API_URL + '/all')
                .set('Authorization', 'Bearer 0' + token)
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should send all profiles when authorized and authenticated', function(done){
            request(server)
                .get(API_URL + '/all')
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    const {description:dump, ...profileData} = savedProfile
                    const {description:dump1, ...profileData1} = savedProfile1

                    expect(res.body).to.deep.equal({
                        [savedProfile.id]: profileData, 
                        [savedProfile1.id]: profileData1
                    })
                    done()
                })
        })
    })
    describe(`PUT ${API_URL}`, function(){
        it('should not update a profile when unauthenticated', function(done){
            request(server)
                .put(API_URL)
                .query({ id: savedProfile.id })
                .send({ status: 'OFFLINE' })
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not update a profile with an invalid token', function(done){
            request(server)
                .put(API_URL)
                .query({ id: savedProfile.id })
                .send({ status: 'OFFLINE' })
                .set('Authorization', 'Bearer 0' + token)
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not update another user\'s profile', function(done){
            request(server)
                .put(API_URL)
                .query({ id: savedProfile1.id })
                .send({ status: 'OFFLINE' })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(403)
                .end(done)
        })
        it('should not update a profile when data is invalid', function(done){
            request(server)
                .put(API_URL)
                .query({ id: savedProfile.id })
                .send({ wrong: 'key' })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(422)
                .end(done)
        })
        it('should update a profile when authorized and authenticated', function(done){
            request(server)
                .put(API_URL)
                .query({ id: savedProfile.id })
                .send({ status: 'OFFLINE' })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(202)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body).to.deep.equal({...savedProfile, status: 'OFFLINE'})
                    done()
                })
        })
    })
    describe(`DELETE ${API_URL}`, function(){
        it('should not delete a profile when unauthenticated', function(done){
            request(server)
                .delete(API_URL)
                .query({ id: savedProfile.id })
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should not delete another user\'s profile', function(done){
            // see #32
            request(server)
                .delete(API_URL)
                .query({ id: savedProfile1.id })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(403)
                .end(done)
        })
        it('should delete a profile when authorized and authenticated', function(done){
            request(server)
                .delete(API_URL)
                .query({ id: savedProfile.id })
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .expect(202)
                .end(done)
        })
    })
})
describe(`${API_URL} notifies websocket clients`, function(){
    /* in this test, we emit with user2 and check events with user1 */
    const user1 = { userId: 'user1', email: 'user1@test.cc', pw: '123'}
    const user2 = { userId: 'user2', email: 'user2@test.cc', pw: '123'}
    
    let user1Profile = { userId: 'user1', description: 'new profile' }
    let user2Profile = { userId: 'user2', description: 'new profile' }
    let token1, token2
    let ws1, ws2

    before(function(done){
        recreate()
        .then(() => auth.service.register(user1))
        .then(() => auth.service.login(user1))
        .then(data => token1 = data.token)
        .then(() => auth.service.register(user2))
        .then(() => auth.service.login(user2))
        .then(data => token2 = data.token)
        .then(() => server.listen(PORT, () => {
            ws1 = socketIoClient(SOCKET_URL, { query: 'token='+token1 })
            ws1.once('connect', () => {
                ws2 = socketIoClient(SOCKET_URL, { query: 'token='+token2 })
                ws2.once('connect', () => {
                    done()
                })
            })
        }))
        .catch(e => done(e))
    })
    it('should update clients on POST /profile', function(done){
        ws1.once('/profile', ({ meta, data }) => {
            expect(meta.status).to.equal(201)
            expect(data.profile).to.deep.equal(user2Profile)
            done()
        })
        ws2.once('/profile', () => done(new Error('should not send event to this client')))
        request(server)
        .post(API_URL + '/')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token2)
        .send(user2Profile)
        .end((e, res) => {
            if(e) done(e)
            user2Profile = res.body.profile
        })
    })
    it('should update other clients on PUT /profile', function(done){
        newKeys = { status: 'OFFLINE' }
        ws1.once('/profile', ({ meta, data }) => {
            expect(meta.status).to.equal(202)
            expect(data.profile).to.deep.equal({...user2Profile, ...newKeys})
            done()
        })
        ws2.once('/profile', () => done(new Error('should not send event to this client')))
        request(server)
        .put(API_URL)
        .query({ id: user2Profile.id })
        .send(newKeys)
        .set('Authorization', 'Bearer ' + token2)
        .set('Content-Type', 'application/json')
        .end(e => {
            if(e) done(e)
        })
    })
    it('should update other clients on DELETE /profile', function(done){
        ws1.once('/profile', ({ meta, data }) => {
            expect(meta.status).to.equal(202)
            expect(data).to.be.undefined
            done()
        })
        ws2.once('/profile', () => done(new Error('should not send event to this client')))
        request(server)
        .delete(API_URL)
        .query({ id: user2Profile.id })
        .set('Authorization', 'Bearer ' + token2)
        .expect(202)
        .end(e => {
            if(e) done(e)
        })
    })
    after(function(done){
        ws1 && ws1.disconnect()
        ws2 && ws2.disconnect()
        server.close(e => done(e))
    })  
})