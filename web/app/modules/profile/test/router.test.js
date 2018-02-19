const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const request = require('supertest')

const server = require('../../../server')
const db = require('../../../db')
const { recreate } = require('../../../manage')
const service = require('../service')

const { auth } = require('../../../modules')

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
        .then(_token => token = _token)
        .then(() => auth.service.register(credentials1))
        .then(() => server.listen(1, () => done()))
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
                    savedProfile = res.body
                    done()
                })
        })
    })
    describe(`GET ${API_URL}`, function(){
        before(function(){
            return service.create(credentials1.userId, profile1)
            .then(profile => savedProfile1 = profile)
        })

        it('should not send a profile that does not exist', function(done){
            request(server)
                .get(API_URL + '/' + 1234)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end(done)
        })
        it('should send a profile when authorized and authenticated', function(done){
            request(server)
                .get(API_URL + '/' + savedProfile.id)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.id).to.not.be.undefined
                    expect(res.body).to.containSubset(savedProfile)
                    done()
                })
        })
        it('should send a profile when requesting a different user\'s profile', function(done){
            request(server)
                .get(API_URL + '/' + savedProfile1.id)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.id).to.not.be.undefined
                    expect(res.body).to.containSubset(savedProfile1)
                    done()
                })
        })
        it('should send a profile when unauthenticated', function(done){
            request(server)
                .get(API_URL + '/' + savedProfile.id)
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((e, res) => {
                    if(e) return done(e)
                    expect(res.body.id).to.not.be.undefined
                    expect(res.body).to.containSubset(savedProfile)
                    done()
                })
        })
    })
    describe(`GET ${API_URL}/all`, function(){
        it('should not send all profiles when unauthenticated', function(){

        })
        it('should not send all profiles when unauthorized', function(){

        })
        it('should send all profiles when authorized and authenticated', function(){

        })
    })
    describe(`PUT ${API_URL}`, function(){
        it('should not update a profile when unauthenticated', function(){

        })
        it('should not update a profile when unauthorized', function(){

        })
        it('should not update a profile when data is invalid', function(){

        })
        it('should update a profile when authorized and authenticated', function(){

        })
    })
    describe(`DELETE ${API_URL}`, function(){
        it('should not delete a profile when unauthenticated', function(){

        })
        it('should not delete a profile when unauthorized', function(){

        })
        it('should delete a profile when authorized and authenticated', function(){

        })
    })
})
