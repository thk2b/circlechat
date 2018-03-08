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
    let channel3 /* this channel remains empty */

    let message1
    let message2
    let message3 /* in channel2 */
    let message4 /* in channel2 */
    
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
            channelService.create(credentials2.userId, { profileId: p2.id, name: 'test channel 2'}),
            channelService.create(credentials2.userId, { profileId: p2.id, name: 'test channel 3'})
        ]))
        .then(([c1, c2, c3]) => {
            channel1 = c1
            channel2 = c2
            channel3 = c3
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
        it('should notify websocket clients', function(){

        })
        after(function(){
            /* create another message in channel1, 2 messages in channel2 */
            return Promise.all([
                service.create(profile1.userId, { profileId: profile1.id, channelId: channel1.id, text: 'test message 2'}),
                service.create(profile1.userId, { profileId: profile1.id, channelId: channel2.id, text: 'test message 3'}),
                service.create(profile1.userId, { profileId: profile1.id, channelId: channel2.id, text: 'test message 4'})
            ])
            .then(([m2, m3, m4]) => {
                message2 = m2
                message3 = m3
                message4 = m4
            })
        })
    })
    describe('get', function(){
        it('should reject when unauthenticated', function(){
            return expect(service.get(undefined, message1.id))
            .to.eventually.be.rejected.and.have.property('status', 401)
        })
        it('should reject when the message does not exist', function(){
            return expect(service.get(credentials1.userId, 999))
            .to.eventually.be.rejected.and.have.property('status', 404)
        })
        it('should resolve with the message when authenticated', function(){
            return service.get(credentials1.userId, message1.id)
            .then(message => {
                expect(message).to.deep.equal(message1)
            })
        })
    })
    describe('get messages in channel', function(){
        it('should reject when unauthenticated', function(){
            return expect(service.inChannel(undefined, channel1.id))
            .to.eventually.be.rejected.and.have.property('status', 401)
        })
        it.skip('should reject when the channel does not exist', function(){
            return expect(service.inChannel(credentials1.userId, 999))
            .to.eventually.be.rejected.and.have.property('status', 404)
        })
        it('should resolve with the messages from the channel when authenticated', function(){
            return service.inChannel(credentials1.userId, channel1.id)
            .then(messages => {
                expect(messages).to.deep.equal({
                    [message1.id]: message1,
                    [message2.id]: message2
                })
            })
        })
        it('should resolve with n messages', function(){
            return service.inChannel(credentials1.userId, channel2.id, n=1)
            .then(messages => {
                expect(messages).to.deep.equal({
                    [message4.id]: message4
                })
            })
        })
        it('should resolve with n messages posted before another message', function(){
            return service.inChannel(credentials1.userId, channel2.id, 1, message4.id)
            .then(messages => {
                expect(messages).to.deep.equal({
                    [message3.id]: message3
                })
            })
        })
        it('should resolve when there are no messages in the channel', function(){
            return service.inChannel(credentials1.userId, channel3.id)
            .then(messages => expect(messages).to.deep.equal({}))
        })
    })
})