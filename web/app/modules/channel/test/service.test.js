const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-subset'))

const { recreate } = require('../../../manage')
const db = require('../../../db')

const { service: authService } = require('../../auth')
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