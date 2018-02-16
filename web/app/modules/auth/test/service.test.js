const chai = require('chai')
const { expect, assert } = chai

const { recreate } = require('../../../manage')
const db = require('../../../db')

const service = require('../service')

describe('auth table', function(){
    it('should create and drop auth table', function(){
        return service.drop()
        .then(() => service.init())
        .then(() => db.one('SELECT EXISTS ( SELECT 1 FROM auth );'))
        .then(({ exists }) => expect(exists).to.be.false)
    })
})

describe('auth service', function(){
    const credentials = { 
        userId: 'tester', 
        email: 'test@test.cc', 
        pw: 'hunter2'
    }

    describe('register', function(){    
        before(function(){
            return recreate()
        })

        it('should save valid credentials to the database', function(){
            return service.register(credentials)
            .then(id => db.any('SELECT * FROM auth'))
            .then(([creds]) => {
                expect(creds.email).to.equal(credentials.email)
                expect(creds.userId).to.equal(credentials.userId)
                expect(creds.pw).not.to.equal(credentials.pw, 'password should be hashed')
            })
        })
        it('should refuse incomplete data', function(){
            return service.register({...credentials, email: 'valid@email.com', userId: undefined})
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 422, message: 'incomplete credentials'
                })
            })
        })
        it('should refuse duplicate email', function(){
            return service.register({...credentials, userId: 'tester2'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 409, message: 'user id or email already in use'
                })
            })
        })
        it('should refuse duplicate userId', function(){
            return service.register({...credentials, email: 'test2@test.cc'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 409, message: 'user id or email already in use'
                })
            })
        })
    })

    describe('login', function(){
        const { userId, email, pw } = credentials
        it('should refuse invalid userId', function(){
            return service.login({ userId: 'idonotexist', pw })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 401, message: 'invalid credentials'
                })
            })
        })
        
        it('should refuse invalid email', function(){
            return service.login({ email: 'idonotexist@test.cc', pw })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 401, message: 'invalid credentials'
                })
            })
        })

        it('should refuse valid email and invalid password', function(){
            return service.login({ email, pw: 'hunter0' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 401, message: 'invalid credentials'
                })
            })
        })

        it('should refuse valid userId and invalid password', function(){
            return service.login({ email, pw: 'hunter0' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 401, message: 'invalid credentials'
                })
            })
        })

        it('should accept valid userId and valid password', function(){
            return service.login({ userId, pw })
            .then(token => {
                expect(token).to.be.a.string
            })
        })        
        it('should accept valid email and valid password', function(){
            return service.login({ email, pw })
            .then(token => {
                expect(token).to.be.a.string
            })
        })

    })

    describe('verifyToken', function(){
        it('should resolve with userId when given a valid token', function(){
            return service.login(credentials)
            .then(service.verifyToken)
            .then(decodedToken => {
                expect(decodedToken).to.equal(credentials.userId)
            })
        })
        it('should reject an invalid token', function(){
            return service.verifyToken('obviously fake token. try harder.')
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    code: 401,
                    message: 'invalid token'
                })
            })
        })
    })
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