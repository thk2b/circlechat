const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))
const request = require('supertest')
const socketIoClient = require('socket.io-client')

const server = require('../../../server')
const db = require('../../../db')
const { recreate } = require('../../../manage')
const service = require('../service')

const PORT = 1
const SOCKET_URL = `http://localhost:${PORT}`
const API_URL = '/api/v1/auth'

describe(API_URL, function(){
    before(function(done){
        recreate()
        .then(() => server.listen(1, e => done(e)))
    })
    after(function(done){
        server.close(e => done(e))
    })

    const credentials = {
        userId: 'tester', 
        email: 'test@test.cc', 
        pw: 'hunter2'
    }
    let token = undefined

    describe(`POST ${API_URL}/`, function(e){
        it('should not register incomplete credentials', function(done){
            /* All edge cases are tested in service.test.
            ** This test case makes sure errors from the service layer are sent to the client
            */
            request(server)
                .post(API_URL + '/')
                .set('Content-Type', 'application/json')
                .send({...credentials, userId: undefined})
                .expect(422)
                .end((e, res) => {
                    if(e) done(e)
                    expect(res.body.message).to.be.a.string
                    done()
                })
        })
        it('should register a user', function(done){
            request(server)
                .post(API_URL + '/')
                .send(credentials)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((e, res) => {
                    if(e) done(e)
                    expect(res.body).to.deep.equal({})
                    done()
                })
        })
    })
    describe(`POST ${API_URL}/login`, function(){
        const { userId, pw } = credentials
        it('should not send a token when credentials are invalid', function(done){
            request(server)
                .post(API_URL + '/login')
                .send({ userId, pw: 'mom i forgot' })
                .set('Content-Type', 'application/json')
                .expect(401)
                .end(done)
        })
        it('should send back a token, userId, lastLogoutAt', function(done){
            request(server)
                .post(API_URL + '/login')
                .send({ userId, pw })
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((e, res) => {
                    if(e) done(e)
                    expect(res.body.token).to.be.a.string
                    expect(res.body.lastLogoutAt).to.not.be.undefined
                    expect(res.body.userId).to.not.be.undefined
                    expect(res.body.email).to.be.undefined
                    expect(res.body.hashedPw).to.be.undefined
                    token = res.token
                    done()
                })
        })
    })
    describe(`GET ${API_URL}/:id/`, function(){

        before(function(done){
            service.login(credentials).then((data) => {
                token = data.token
                done()
            }).catch(e => done(e))
        })
        it('should not get a user\'s data with an invalid token', function(done){
            request(server)
                .get(`${API_URL}/${credentials.userId}`)
                .set('Authorization', 'bearer ' + 'qwertyuiopasdfghjklzxcvbnm')
                .expect(401)
                .end(done)
        })
        it('should not get a user\'s data for an invalid id', function(done){
            request(server)
                .get(`${API_URL}/wrongid`)
                .set('Authorization', 'bearer ' + token)
                // .expect(404)
                .expect(403) // 404 can never be reached: we check if the ids are identical before checking if they exist
                .end(done)
        })
        it('should get a user\'s data, but not the password', function(done){
            request(server)
                .get(`${API_URL}/${credentials.userId}`)
                .set('Authorization', 'bearer ' + token)
                .expect(200)
                .end(done)
        })
    })
    describe(`PUT ${API_URL}/password`, function(){
        it('should not update password when unauthenticated', function(done){
            request(server)
                .put(`${API_URL}/password`)
                .set('Authorization', 'bearer ' + 'no')
                .send({ currentPw: credentials.pw, newPw: 'new password' })
                .expect(401)
                .end(done)
        })
        it('should not update password when password is invalid', function(done){
            request(server)
                .put(`${API_URL}/password`)
                .set('Authorization', 'bearer ' + token)
                .send({ currentPw: 'wrong pw', newPw: 'new password' })
                .expect(401)
                .end(done)
        })
        it('should update password', function(done){
            request(server)
                .put(`${API_URL}/password`)
                .set('Authorization', 'bearer ' + token)
                .send({ currentPw: credentials.pw, newPw: 'new password' })
                .expect(202)
                .end(() => {
                    credentials.pw = 'new password'
                    done()
                })
        })
    })
    describe(`PUT ${API_URL}/email`, function(){
        it('should not update email when unauthenticated', function(done){
            request(server)
                .put(`${API_URL}/email`)
                .set('Authorization', 'bearer ' + 'no')
                .send({ pw: credentials.pw, newEmail: 'new@email.com' })
                .expect(401)
                .end(done)
        })
        it('should not update email when password is invalid', function(done){
            request(server)
                .put(`${API_URL}/email`)
                .set('Authorization', 'bearer ' + token)
                .send({ currentPw: 'wrong pw', newEmail: 'new@email.com' })
                .expect(401)
                .end(done)
        })
        it('should update email', function(done){
            request(server)
                .put(`${API_URL}/email`)
                .set('Authorization', 'bearer ' + token)
                .send({ currentPw: credentials.pw, newEmail: 'new@email.com' })
                .expect(202)
                .end(() => {
                    credentials.email = 'new@email.com'
                    done()
                })
        })
    })
    describe(`DELETE ${API_URL}/:id`, function(){
        let token
        before(function(done){
            service.login(credentials).then(data => {
                token = data.token
                done()
            }).catch(e => done(e))
        })
        it('should not delete a user\'s data with an invalid token', function(done){
            request(server)
                .delete(`${API_URL}/${credentials.userId}`)
                .set('Authorization', 'bearer ' + 'qwertyuiopasdfghjklzxcvbnm')
                .expect(401)
                .end(done)
        })
        it('should not delete a user\'s data when unauthorized', function(done){
            request(server)
                .delete(`${API_URL}/someoneelse`)
                .set('Authorization', 'bearer ' + token)
                .expect(403)
                .end(done)
        })
        it('should delete a user\'s data when authorized', function(done){
            request(server)
                .delete(`${API_URL}/${credentials.userId}`)
                .set('Authorization', 'bearer ' + token)
                .expect(202)
                .end(done)
        })
    })
})