const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))

const { recreate } = require('../../../manage')
const db = require('../../../db')

const { service: authService } = require('../../auth')
const { service: profileService } = require('../../profile')
const { service: channelService } = require('../../channel')
const service = require('../service')

describe('message table', function(){
    it('should create and drop message table', function(){
        return service.drop()
        .then(() => service.init())
        .then(() => db.one('SELECT to_regclass(\'public.message\')'))
        .then(({ to_regclass }) => expect(to_regclass).to.equal('message'))
        .then(() => service.drop())
        .then(() => db.one('SELECT to_regclass(\'public.message\')'))
        .then(({ to_regclass }) => expect(to_regclass).to.be.null)
    })
})

describe('message service', function(){
    const credentials1 = {userId: 'tester1', email: 'tester1@test.cc', pw: 'hunter1'}
    const credentials2 = {userId: 'tester2', email: 'tester2@test.cc', pw: 'hunter2'}
    
    let profile1
    let profile2

    let channel1
    let channel2

    let message1
    let message2
    
    before(function(){

        /* register users, create their profiles, and create channels */
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
            return [p1, p2]
        })
        .then(([p1, p2]) => Promise.all([
            channelService.create(credentials1.userId, { profileId: p1.id, name: 'test channel 1'}),
            channelService.create(credentials2.userId, { profileId: p2.id, name: 'test channel 2'})
        ]))
        .then(([c1, c2]) => {
            channel1 = c1
            channel2 = c2
        })
    })
    describe('create', function(){
        it('should not create a message when the profile does not belong to the user', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile2.id, channelId: channel1.id, text: 'test message' })
            ).to.eventually.be.rejected.and.have.property('status', 403)
        }) 
        it('should not create a message when the user is unauthenticated', function(){
            return expect(
                service.create(undefined, { profileId: profile1.id, channelId: channel1.id, text: 'test message' })
            ).to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should not create a message when the text is empty', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile1.id, channelId: channel1.id, text: '' })
            ).to.eventually.be.rejected.and.have.property('status', 422)
        })
        it('should not create a message when the profileId is empty', function(){
            return expect(
                service.create(profile1.userId, { profileId: undefined, channelId: channel1.id, text: 'test message'  })
            ).to.eventually.be.rejected.and.have.property('status', 422)
        })
        it('should not create a message when the channelId is empty', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile1.id, channelId: undefined, text: 'test message'  })
            ).to.eventually.be.rejected.and.have.property('status', 422)
        })
        it('should not create a message when the profile does not exist', function(){
            return expect(
                service.create(profile1.userId, { profileId: 999, channelId: channel1.id, text: 'test message'  })
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should not create a message when the channel does not exist', function(){
            return expect(
                service.create(profile1.userId, { profileId: profile1.id, channelId: 999, text: 'test message'  })
            ).to.eventually.be.rejected.and.have.property('status', 403)
        })
        it('should create a message when the user is authorized and authenticated', function(){
            return service.create(profile1.userId, { profileId: profile1.id, channelId: channel1.id, text: 'test message 1'  })
            .then((message) => {
                message1 = message
                expect(message.id).to.not.be.undefined
                expect(message.createdAt).to.not.be.undefined
                expect(message.updatedAt).to.not.be.undefined
                expect(message.text).to.equal('test message 1')
                expect(message.profileId).to.equal(profile1.id)
                expect(message.channelId).to.equal(channel1.id)
            })
        })
    })
})