const chai = require('chai')
const { expect } = chai

const { recreate } = require('../../../manage')
const db = require('../../../db')

const service = require('../service')

describe('auth table', function(){
    it('should create and drop auth table', function(done){
        service.drop().then(() => {
            service.init().then(() => {
                db.any('SELECT EXISTS ( SELECT 1 FROM auth );')
                    .then(() => done())
                    .catch(e => done(e))
            })
        }).catch(e => done(e))
    })
})

describe('auth service', function(){
    const credentials = { 
        userId: 'tester', 
        email: 'test@test.cc', 
        pw: 'hunter2'
    }

    describe('register', function(){    
        before(function(done){
            recreate()
                .then(() => done())
                .catch(e => done(e))
        })

        it('should save valid credentials to the database', function(done){
            service.register(credentials)
                .then(id => db.any('SELECT * FROM auth'))
                .then(([creds]) => {
                    expect(creds.email).to.equal(credentials.email)
                    expect(creds.userId).to.equal(credentials.userId)
                    expect(creds.pw).not.to.equal(credentials.pw, 'password should be hashed')
                })
                .then(() => done())
                .catch(e => done(e))
        })
        it('should refuse incomplete data', function(done){
            service.register({...credentials, userId: undefined})
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 422, message: 'incomplete credentials'
                    })
                })
                .then(() => done())
                .catch(e => done(e))
        })
        it('should refuse duplicate email', function(done){
            service.register({...credentials, userId: 'tester2'})
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 409, message: 'user id or email already in use'
                    })
                })
                .then(() => done())
                .catch(e => done(e))
        })
        it('should refuse duplicate userId', function(done){
            service.register({...credentials, email: 'test2@test.cc'})
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 409, message: 'user id or email already in use'
                    })
                })
                .then(() => done())
                .catch(e => done(e))
        })
    })

    describe('login', function(){
        const { userId, email, pw } = credentials
        it('should refuse invalid userId', function(done){
            service.login({ userId: 'idonotexist', pw})
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 401, message: 'invalid credentials'
                    })
                })
                .then(() => done())
                .catch(e => done(e))
        })
        
        it('should refuse invalid email', function(done){
            service.login({ email: 'idonotexist@test.cc', pw})
                .then(() => done(new Error()))    
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 401, message: 'invalid credentials'
                    })
                })
                .catch(e => done(e))
                .then(() => done())
        })

        it('should refuse valid email and invalid password', function(done){
            service.login({ email, pw: 'hunter0' })
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 401, message: 'invalid credentials'
                    })
                })
                .then(() => done())
                .catch(e => done(e))
        })

        it('should refuse valid userId and invalid password', function(done){
            service.login({ email, pw: 'hunter0' })
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 401, message: 'invalid credentials'
                    })
                })
                .then(() => done())
                .catch(e => done(e))
        })

        it('should accept valid userId and valid password', function(done){
            service.login({ userId, pw})
                .then(token => {
                    expect(token).to.be.a.string
                })
                .then(() => done())
                .catch(e => done(e))
        })        
        it('should accept valid email and valid password', function(done){
            service.login({ email, pw})
                .then(token => {
                    expect(token).to.be.a.string
                })
                .then(() => done())
                .catch(e => done(e))
        })

    })

    // describe('verifyToken', function(){
    //     it('should reject an invalid token', function(done){
            
    //     })
    //     it('should resolve with userId when given a valid token', function(done){
            
    //     })
    // })
    describe('update', function(){
        before(function(done){
            recreate()
                .then(() => done())
                .catch(e => done(e))
        })
        it('', function(done){
            done(false)
        })
    })

    describe('delete', function(){
        before(function(done){
            recreate()
                .then(() => done())
                .catch(e => done(e))
        })
        it('', function(done){
            done(false)
        })
    })
})