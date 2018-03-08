const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-as-promised'))

const { recreate } = require('../../../manage')
const db = require('../../../db')

const { service: authService } = require('../../auth')
const { service: profileService } = require('../../profile')
const service = require('../service')

describe('channel table', function(){
    it('should create and drop channel table', function(){
        return service.drop()
        .then(() => service.init())
        .then(() => db.one('SELECT to_regclass(\'public.channel\')'))
        .then(({ to_regclass }) => expect(to_regclass).to.equal('channel'))
        .then(() => service.drop())
        .then(() => db.one('SELECT to_regclass(\'public.channel\')'))
        .then(({ to_regclass }) => expect(to_regclass).to.be.null)
    })
})

describe('channel service', function(){
    const credentials1 = {userId: 'tester1', email: 'tester1@test.cc', pw: 'hunter1'}
    const credentials2 = {userId: 'tester2', email: 'tester2@test.cc', pw: 'hunter2'}
    
    let profile1
    let profile2

    let channel1
    let channel2
    
    before(function(){
        /* register users and create their profiles */
        return recreate()
        .then(() => Promise.all([
            authService.register(credentials1),
            authService.register(credentials2)
        ]))
        .then(() => Promise.all([
            profileService.create(credentials1.userId, { userId: credentials1.userId }),
            profileService.create(credentials2.userId, { userId: credentials2.userId })
        ]))
        .then(([p1, p2]) => {
            profile1 = p1
            profile2 = p2
        })
    })
    describe('create', function(){
        it('should not create a channel when the profile does not belong to the user', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile2.id, name: 'channel0' })
            ).to.eventually.be.rejected.and.have.property('status', 403)
        }) 
        it('should not create a channel when the user is unauthenticated', function(){
            return expect(
                service.create(undefined, { profileId: profile1.id, name: 'channel1' })
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not create a channel when the name is empty', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile1.id, name: undefined })
            ).to.eventually.be.rejected.and.have.property('status', 422)
        })
        it('should not create a channel when the profileid is empty', function(){
            return expect(
                service.create(profile1.userId, { profileId: undefined, name: 'profile1' })
            ).to.eventually.be.rejected.and.have.property('status', 422)
        })
        it('should not create a message when the profile does not exist', function(){
            return expect(
                service.create(profile1.userId, { profileId: 999, name: 'test channel'})
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should create a channel when the user is authorized and authenticated', function(){
            return service.create(profile1.userId, { profileId: profile1.id, name: 'channel1' })
            .then((channel) => {
                channel1 = channel
                expect(channel.id).to.not.be.undefined
                expect(channel.createdAt).to.not.be.undefined
                expect(channel.updatedAt).to.not.be.undefined
                expect(channel.name).to.equal('channel1')
                expect(channel.profileId).to.equal(profile1.id)
            })
        })
        it('should not create a channel when the name is already in use', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile1.id, name: 'channel1' })
            ).to.eventually.be.rejected.and.have.property('status', 409)
        })
    })
    describe('get', function(){
        it('should reject when unauthenticated', function(){
            return expect(service.get(undefined, channel1.id))
            .to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should reject when the channel does not exist', function(){
            return expect(service.get(credentials1.userId, 999))
            .to.eventually.be.rejected.and.have.property('status', 404)
        })
        it('should resolve with the channel when authenticated', function(){
            return service.get(credentials1.userId, channel1.id)
            .then(channel => {
                expect(channel).to.deep.equal(channel1)
            })
        })
    })
    describe('getAll', function(){
        before(function(){
            return service.create(profile2.userId, { profileId: profile2.id, name: 'channel2' })
            .then(c => { channel2 = c })
        })
        it('should reject when unauthenticated', function(){
            return expect(service.getAll(undefined))
            .to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should resolve with all channels when authenticated', function(){
            return service.getAll(credentials1.userId)
            .then(channels => {
                expect(channels).to.deep.equal({
                    [channel1.id]: channel1,
                    [channel2.id]: channel2
                })
            })
        })
    })
    describe('belongsToUser', function(){
        it('should return false if the channel does not belong to user', function(){
            return expect(
                service.belongsToUser(channel1.id, credentials2.userId)
            ).to.eventually.equal(false)
        })
        it('should return true if the channel belongs to user', function(){
            return expect(
                service.belongsToUser(channel1.id, credentials1.userId)
            ).to.eventually.equal(true)
        })
    })
    describe('update', function(){
        it('should not update when authenticated', function(){
            return expect(
                service.update(undefined, channel1.id, {name: 'some name'})
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not update forbidden fields', function(){
            return expect(
                service.update(credentials1.userId, channel1.id, {id: 123})
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should not update a channel created by another user', function(){
            return expect(
                service.update(credentials1.userId, channel2.id, { name: 'some new name'})
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should update when authorized and authenticated, and set updatedAt', function(){
            const update = { name: 'new name' }
            return service.update(credentials1.userId, channel1.id, update)
            .then(channel => {
                expect(channel.updatedAt).to.not.equal(channel1.createdAt)
                delete channel.updatedAt
                expect(channel).to.deep.equal({ id: channel1.id, ...update })
            })
        })
        it.skip('should update multiple keys when authorized and authenticated', function(){
            // implemented but cannot test at the moment: only one key is allowed to be modified...
            const update = {name: 'new name' } 
            return service.update(credentials1.userId, channel1.id, update)
            .then(channel => {
                expect(channel.updatedAt).to.not.equal(channel1.createdAt)
                delete channel.updatedAt
                expect(channel).to.deep.equal({...channel1, ...update })
            })
        })
    })
    describe('remove', function(){
        it('should not remove the channel when unauthenticated', function(){
            return expect(
                service.remove(undefined, channel1.id)
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not remove the channel when unauthorized', function(){
            return expect(
                service.remove(credentials1.userId, channel2.id)
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should remove the channel when authenticated and authorized', function(){
            return service.remove(credentials1.userId, channel1.id)
            .then(() => service.get(credentials1.userId, channel1.id))
            .then(() => { throw new Error('should not resolve') })
            .catch(e => {
                expect(e).to.contain({ status: 404, message: 'not found'})
            })
        })
    })
})