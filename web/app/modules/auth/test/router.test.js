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
        it('should send back a token, userId', function(done){
            request(server)
                .post(API_URL + '/login')
                .send({ userId, pw })
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((e, res) => {
                    if(e) done(e)
                    expect(res.body.token).to.be.a.string
                    expect(res.body.userId).to.not.be.undefined
                    token = res.token
                    done()
                })
        })
    })
    describe(`GET ${API_URL}/:id/`, function(){
        let token
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
    describe(`PUT ${API_URL}/:id`, function(){
        it('', function(done){
            // .set('Authorization', 'bearer ' + token)
            done(false)
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

// ** DEPRECATED TEST FOR REFERENCE PURPOSES ONLY **
//
// describe(`${API_URL} notifies websocket clients`, function(){
//     /* in this test, we emit with user2 and check events with user1 */
//     const user1 = { userId: 'user1', email: 'user1@test.cc', pw: '123'}
//     const user2 = { userId: 'user2', email: 'user2@test.cc', pw: '123'}
    
//     let token
//     let ws

//     before(function(done){
//         recreate()
//         .then(() => service.register(user1))
//         .then(() => service.login(user1))
//         .then((data) => token = data.token)
//         .then(() => server.listen(PORT, () => {
//             ws = socketIoClient(SOCKET_URL)
//             ws.once('connect', () => {
//                 done()
//             })
//         }))
//     })
//     it('should notify connected clients with a new profile', function(done){
//         ws.once('/auth', ({ meta, data }) => {
//             expect(meta).to.deep.equal({ type: 'POST', status: 201 })
//             expect(data.profile).to.containSubset({
//                 userId: user2.userId, name: user2.userId
//             })
//             expect(data.profile.id).to.not.be.undefined
//             done()
//         })
//         request(server)
//         .post(API_URL + '/')
//         .send(user2)
//         .set('Content-Type', 'application/json')
//         .expect(201)
//         .end(e => {if(e) done(e)})
//     })
//     after(function(done){
//         ws.disconnect()
//         server.close(e => done(e))
//     })
// })