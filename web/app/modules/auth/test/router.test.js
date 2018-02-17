const chai = require('chai')
const { expect } = chai
const request = require('supertest')


const server = require('../../../server')
const db = require('../../../db')

const { recreate } = require('../../../manage')

const API_URL = '/api/v1/auth'

describe(API_URL, function(){
    before(function(done){
        recreate()
        .then(() => server.listen(1, () => done()))
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
                    expect(res.body.userId).to.equal(credentials.userId)
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
        it('should send back a token', function(done){
            request(server)
                .post(API_URL + '/login')
                .send({ userId, pw })
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((e, res) => {
                    if(e) done(e)
                    expect(res.body.token).to.be.a.string
                    token = res.token
                    done()
                })
        })
    })

    describe(`POST ${API_URL}/:id/`, function(){
        it('', function(done){
            done(false)
        })
    })

    describe(`PUT ${API_URL}/:id`, function(){
        it('', function(done){
            done(false)
        })
    })
})

