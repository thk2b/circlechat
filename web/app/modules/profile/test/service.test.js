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
    let savedProfile
    let savedProfile1

    before(function(){
        return recreate()
        .then(() => Promise.all([
            authService.register(credentials),
            authService.register(credentials1)
        ]))
    })
    describe('create', function(){
        it('should refuse to create a profile if the userId is not authenticated', function(){
            return service.create(null, { userId: credentials1.userId })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 401, message: 'unauthenticated'
                })
            })
        })
        it('should refuse to create a profile if the userId is not the requester\'s', function(){
            return service.create(credentials.userId, { userId: credentials1.userId })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
                    status: 403, message: 'forbidden'
                })
            })
        })
        it('should refuse to create a profile if the userId is not provided', function(){
           return service.create(credentials.userId, {})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({
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
                savedProfile = profile
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
                savedProfile1 = profile
            })
        })
    })
    describe('get profile', function(){
        it('should refuse to get a profile that does not exist', function(){
            return service.get(null, 1234)
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({ status: 404, message: 'not found'})
            })
        })
        it('should allow getting a profile if unauthenticated', function(){
            return service.get(null, savedProfile.id)
            .then(profile => {
                expect(profile).to.deep.equal(savedProfile)
            })
        })
        it('should get a single profile when authenticated', function(){
            return service.get(credentials1.userId, savedProfile1.id)
            .then(profile1 => {
                expect(profile1).to.deep.equal(savedProfile1)
            })
        })
    })
    describe('get profile of user', function(){
        it('should not return a user\'s profile when unathenticated', function(){
            expect(
                service.of.user(null, credentials.userId)
            ).to.be.rejectedWith({ status: 401, message: 'unauthorized'})
        })
        it('should not return a user\'s profile when unauthorized', function(){
            expect(
                service.of.user(null, credentials.userId)
            ).to.be.rejectedWith({ status: 403, message: 'forbidden'})
        })
        it('should return a user\'s profile when authenticated and authorized', function(){
            return service.of.user(credentials.userId, credentials.userId)
            .then(data => {
                expect(data).to.deep.equal(savedProfile)
            })
        })
    })
    describe('get all profiles', function(){
        it('should refuse to get all profiles if not authenticated', function(){
            return service.getAll(null)
            .then(() =>{ throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({ status: 401, message: 'unauthenticated'})
            })

        })
        it('should get all profiles', function(){
            return service.getAll(credentials.userId)
            .then(profiles => {
                expect(profiles).to.deep.equal({
                    [savedProfile.id]: savedProfile, 
                    [savedProfile1.id]: savedProfile1
                })
            })
        })
    })
    describe('update profile', function(){
        it('should refuse to update the profile when unauthenticated', function(){
            return service.update(null, savedProfile.id, { status: 'OFFLINE' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({ status: 401, message: 'unauthenticated'})
            })
        })
        it.skip('should refuse to update status with an invalid status', function(){
            // TODO: create status table. enforce this wiht foreign key constraint: satus must exist in status table
            // see #34
            return service.update(credentials.userId, savedProfile.id, { status: 'invalid' })
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({ status: 422, message: 'invalid data'})
            })
        })
        it('should refuse to update another user\'s profile', function(){
            return service.update(credentials.userId, savedProfile1.id, { status: 'OFFLINE'})
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({ status: 403, message: 'forbidden'})
            })
        })
        it('should update the profile with one key/value pair', function(){
            const newProfile = {
                description: 'new description'
            }
            return service.update(credentials.userId, savedProfile.id, newProfile)
            .then(updatedProfile => {
                expect(updatedProfile).to.deep.equal({...savedProfile, ...newProfile})
            })
        })
        it('should update the profile with multiple keys at once', function(){
            const newProfile = {
                description: 'another description', name: 'new name'
            }
            return service.update(credentials.userId, savedProfile.id, newProfile)
            .then(updatedProfile => {
                expect(updatedProfile).to.deep.equal({...savedProfile, ...newProfile})
            })
        })
    })
    describe('remove profile', function(){
        it('should refuse to remove the profile when unauthenticated', function(){
            return service.remove(null, savedProfile.id)
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({ status: 401, message: 'unauthenticated'})
            })
        })
        it('should refuse to remove the profile when the profile belongs to another user', function(){
            return service.remove(credentials1.userId, savedProfile.id)
            .then(() => { throw new Error('should not resolve')})
            .catch(e => {
                expect(e).to.containSubset({ status: 403, message: 'forbidden'})
            })
        })
        it('should delete the profile', function(){
            return service.remove(credentials1.userId, savedProfile1.id)
            .then(() => service.get(savedProfile1.id))
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.containSubset({ status: 404, message: 'not found'})
            })
        })
    })
})