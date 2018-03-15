const chai = require('chai')
const { expect } = chai
chai.use(require('chai-as-promised'))
chai.use(require('chai-subset'))
const SQL = require('sql-template-strings')

const { recreate } = require('../../../manage')
const db = require('../../../db')

const service = require('../service')
const { service: profileService } = require('../../profile')

describe('auth table', function(){
    it('should create and drop auth table', function(){
        return service.drop()
        .then(() => service.init())
        .then(() => db.one('SELECT to_regclass(\'public.auth\')'))
        .then(({ to_regclass }) => expect(to_regclass).to.equal('auth'))
        .then(() => service.drop())
        .then(() => db.one('SELECT to_regclass(\'public.auth\')'))
        .then(({ to_regclass }) => expect(to_regclass).to.be.null)
    })
})

describe('auth service', function(){
    const credentials = { 
        userId: 'tester2', 
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
                expect(creds.registeredAt).to.not.be.undefined
                expect(creds.lastLogoutAt).to.be.null
                expect(creds.pw).not.to.equal(credentials.pw, 'password should be hashed')
            })
        })
        it('should refuse incomplete data', function(){
            return service.register({...credentials, email: 'valid@email.com', userId: undefined})
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({
                    status: 422, message: 'invalid credentials'
                })
            })
        })
        it('should refuse duplicate email', function(){
            return service.register({...credentials, userId: 'tester2'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 409, message: 'duplicate data'
                })
            })
        })
        it('should refuse duplicate userId', function(){
            return service.register({...credentials, email: 'test2@test.cc'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 409, message: 'duplicate data'
                })
            })
        })
        it('should refuse empty userId', function(){
            return service.register({...credentials, userId: ''})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 422, message: 'invalid credentials'
                })
            })
        })
        it('should not have created a profile on successfull register', function(){
            return profileService.getAll(credentials.userId)
            .then((profiles) => {
                const id = Object.keys(profiles)[0]
                expect(id).to.be.undefined
            })
        })
    })
    describe('get', function(){
        it('should refuse when the requester is not permitted', function(){
            service.get('someone', credentials.userId)
            .then(e => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({
                    status: 403, message: 'forbidden'
                })
            })
        })
        it('should refuse invalid userId', function(){
            service.get('nobody', 'nobody')
            .then(e => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({
                    status: 404, message: 'not found'
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
                expect(e).to.containSubset({
                    status: 401, message: 'invalid credentials'
                })
            })
        })
        
        it('should refuse invalid email', function(){
            return service.login({ email: 'idonotexist@test.cc', pw })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 401, message: 'invalid credentials'
                })
            })
        })

        it('should refuse valid email and invalid password', function(){
            return service.login({ email, pw: 'hunter0' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 401, message: 'invalid credentials'
                })
            })
        })

        it('should refuse valid userId and invalid password', function(){
            return service.login({ email, pw: 'hunter0' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 401, message: 'invalid credentials'
                })
            })
        })

        it('should accept valid userId and valid password', function(){
            return service.login({ userId, pw })
            .then(({token, userId, lastLogoutAt }) => {
                expect(userId).not.to.be.undefined
                expect(lastLogoutAt).not.to.be.undefined
                expect(token).to.be.a.string
            })
        })        
        it('should accept valid email and valid password', function(){
            return service.login({ email, pw })
            .then(({token, userId }) => {
                expect(userId).not.to.be.undefined
                expect(token).to.be.a.string
            })
        })
    })
    describe('logout', function(){
        it('should not logout when unauthenticated ', function(){
            return expect(
                service.logout(undefined, credentials.userId)
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not logout another user ', function(){
            return expect(
                service.logout(credentials.userId, 'someone else')
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should update lastLogoutAt', function(){
            return service.logout(credentials.userId, credentials.userId)
            .then(user => {
                expect(user.lastLogoutAt).to.not.be.undefined
            })
        })
    })
    describe('verifyToken', function(){
        it('should resolve with userId when given a valid token', function(){
            return service.login(credentials)
            .then(data => service.verifyToken(data.token))
            .then(decodedToken => {
                expect(decodedToken).to.equal(credentials.userId)
            })
        })
        it('should reject an invalid token', function(){
            return service.verifyToken('obviously fake token. try harder.')
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 401,
                    message: 'invalid token'
                })
            })
        })
    })
    describe('update email', function(){
        it('should not update email when unauthenticated', function(){
            return expect(
                service.updateEmail(undefined, credentials.userId, {
                    pw:  credentials.pw, newEmail: 'newmail@abc.com'
                })
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not update email when password is incorrect', function(){
            return expect(
                service.updateEmail(credentials.userId, credentials.userId, {
                    pw:  'wrong password', newEmail: 'newmail@abc.com'
                })
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not update another user\'s email', function(){
            return expect(
                service.updateEmail(credentials.userId, 'someone else', {
                    pw:  credentials.pw, newEmail: 'newmail@abc.com'
                })
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should update email when authenticated and authorized', function(){
            service.updateEmail(credentials.userId, credentials.userId, {
                pw:  credentials.pw, newEmail: 'newmail@abc.com'
            })
            .then(user => {
                expect(user.email).to.equal('newmail@abc.com')
            })
        })
    })
    describe('update password', function(){
        it('should not update password when unauthenticated', function(){
            return expect(
                service.updatePw(undefined, credentials.userId, {
                    currentPw: credentials.pw, newPw: 'new password'
                })
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not update password when current password is incorrect', function(){
            return expect(
                service.updatePw(credentials.userId, credentials.userId, {
                    currentPw: 'wrongpw', newPw: 'new password'
                })
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not update another user\'s password', function(){
            return expect(
                service.updatePw(credentials.userId, 'someone else', {
                    currentPw: credentials.pw, newPw: 'new password'
                })
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should update password when authenticated and authorized', function(){
            service.updatePw(credentials.userId, credentials.userId, {
                currentPw: credentials.pw, newPw: 'new password'
            })
            .then(() => service.login({ userId: credentials.userId, pw: 'new password'}))
            .then(({ token }) => expect(token).to.not.be.undefined)
        })
    })
    describe('remove', function(){
        it('should not remove credentials when requester is unauthenticated', function(){
            return service.remove(null, credentials.userId)
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({
                    status: 401, message: 'unauthenticated'
                })
            })
        })
        it('should not remove credentials when requester is unauthorized', function(){
            return service.remove('whatamidoing', credentials.userId)
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({
                    status: 403, message: 'forbidden'
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