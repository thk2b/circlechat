const chai = require('chai')
const { expect, assert } = chai
const SQL = require('sql-template-strings')

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
    before(function(){
        return recreate()
    })
    describe('register', function(){
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
                    status: 422, message: 'incomplete credentials'
                })
            })
        })
        it('should refuse duplicate email', function(){
            return service.register({...credentials, userId: 'tester2'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 409, message: 'user id or email already in use'
                })
            })
        })
        it('should refuse duplicate userId', function(){
            return service.register({...credentials, email: 'test2@test.cc'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 409, message: 'user id or email already in use'
                })
            })
        })
    })

    describe('get', function(){
        it('should refuse when the requester is not permitted', function(){
            service.get('someone', credentials.userId)
            .then(e => { throw new Error() })
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 401, message: 'unauthorized'
                })
            })
        })
        it('should refuse invalid userId', function(){
            service.get('nobody', 'nobody')
            .then(e => { throw new Error() })
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 404, message: 'user not found'
                })
            })
        })
        it('should resolve with a user when the id is valid and the requester is permitted', function(){
            service.get(credentials.userId, credentials.userId)
            .then(user => {
                expect(user.userId).to.equal(credentials.userId)
                expect(user.email).to.equal(credentials.email)
                expect(user.pw).to.be.undefined
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
                    status: 401, message: 'invalid credentials'
                })
            })
        })
        
        it('should refuse invalid email', function(){
            return service.login({ email: 'idonotexist@test.cc', pw })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 401, message: 'invalid credentials'
                })
            })
        })

        it('should refuse valid email and invalid password', function(){
            return service.login({ email, pw: 'hunter0' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 401, message: 'invalid credentials'
                })
            })
        })

        it('should refuse valid userId and invalid password', function(){
            return service.login({ email, pw: 'hunter0' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 401, message: 'invalid credentials'
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
                    status: 401,
                    message: 'invalid token'
                })
            })
        })
    })
    describe('update', function(){
        const { userId, email, pw } = credentials

        it('should not update userId', function(){
            return service.update(userId, { userId: 'newId' })
        })
        it('should update email', function(){
            return service.update(userId, { email: 'new@email.cc' })
            .then(data => {
                expect(data.email).to.equal(email)
            })
        })

        it('should update and hash password', function(){
            return db.one(SQL`SELECT pw as "oldPw" FROM auth WHERE "userId"=${userId}`)
            .then(({ oldPw }) => {
                service.update(userId, { pw: 'muuuch better passphrase' })
                .then(data => {
                    expect(data.email).to.equal(email)
                    expect(data.userId).to.equal(userId)
                    expect(data.pw).not.to.equal(oldPw)
                    expect(data.pw).not.to.equal('newpw', 'password should be hashed')
                })
            })
        })
        it('should update both email an password at once', function(){
            const payload = { pw: 'newpw', email: 'new@email2.cc' }
            return service.update(userId, payload)
            .then(data => {
                console.log(data)
                expect(data.email).to.equal(payload.email)
            })
        })
    })

    describe('delete', function(){
        it('should not remove credentials when requester is unauthenticated', function(){
            return service.remove(null, credentials.userId)
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 401, message: 'unauthorized'
                })
            })
        })
        it('should not remove credentials when requester is unauthorized', function(){
            return service.remove('whatamidoing', credentials.userId)
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 401, message: 'unauthorized'
                })
            })
        })
        it('should remove the credentials', function(){
            return service.remove(credentials.userId, credentials.userId)
            .then(() => db.one(SQL`SELECT EXISTS (SELECT * FROM auth WHERE "userId"=${credentials.userId});`))
            .then(({ exists }) => expect(exists).to.be.false) 
        })
    })
})