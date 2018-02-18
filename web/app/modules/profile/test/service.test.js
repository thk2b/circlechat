const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))

const { recreate } = require('../../../manage')
const db = require('../../../db')

const { service: authService } = require('../../auth')
const service = require('../service')

describe('profile table', function(){
    it('should create and drop profile table', function(){
        return service.drop()
        .then(() => service.init())
        .then(() => db.one('SELECT EXISTS (SELECT 1 FROM profile)'))
        .then(({ exists }) => expect(exists).to.be.false)
    })
})

describe('profile service', function(){
    const credentials = {userId: 'tester', email: 'tester@test.cc', pw: 'hunter2'}

    const credentials1 = {userId: 'tester1', email: 'tester1@test.cc', pw: 'hunter3'}
    const profile1 = {
        userId: credentials1.userId,
        name: 'test name 1',
        description: 'my second test profile. not much else to say'
    }
    before(function(){
        return recreate()
        .then(() => Promise.all([
            authService.register(credentials),
            authService.register(credentials1)
        ]))
    })
    describe('create', function(){
        it('should refuse to create a profile if the userId is not the requester\'s', function(){
            return service.create(credentials.userId, { userId: credentials1.userId })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 403, message: 'not permitted'
                })
            })
        })
        it('should refuse to create a profile if the userId is not provided', function(){
           return service.create(credentials.userId, {})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.deep.equal({
                    status: 422, message: 'invalid data'
                })
            })
        })
        it('should create a `default` profile when the data is valid', function(){
            return service.create(credentials.userId, { userId: credentials.userId })
            .then((profile) => {
                expect(profile).to.containSubset({
                    userId: credentials.userId,
                    name: credentials.userId,
                    description: '',
                    status: 'ONLINE'
                })
                expect(profile.userId).to.be.a.string
            })
        })
        it('should create a profile when the data is valid', function(){
            return service.create(credentials1.userId, profile1)
            .then((profile) => {
                expect(profile).to.containSubset({
                    ...profile1,
                    status: 'ONLINE'
                })
                expect(profile.userId).to.be.a.string
            })
        })
    })
    
    describe('get profile', function(){
        it('', function(){
    
        })
    })
    describe('get all profiles', function(){
        it('', function(){
    
        })
    })
    // describe('', function(){
    //     it('', function(){
    
    //     })
    // })
})