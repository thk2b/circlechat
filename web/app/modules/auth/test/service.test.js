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

        it('should save credentials to the database', function(done){
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
        it('should refuse duplicate email', function(done){
            service.register({...credentials, userId: 'tester2'})
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 409, message: 'userId or email already in use'
                    })
                    done()
                })
        })
        it('should refuse duplicate userId', function(done){
            service.register({...credentials, email: 'test2@test.cc'})
                .then(() => done(new Error()))
                .catch(e => {
                    expect(e).to.deep.equal({
                        code: 409, message: 'userId or email already in use'
                    })
                    done()
                })
        })
    })

    describe('login', function(){
        before(function(done){
            recreate()
                .then(() => done())
                .catch(e => done(e))
        })
        it('', function(done){
            done(false)
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