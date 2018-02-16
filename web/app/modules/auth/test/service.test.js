const chai = require('chai')
const { expect } = chai

const { recreate } = require('../../../manage')

const service = require('../service')

describe('auth service', function(){
    beforeEach(function(done){
        recreate()
        .then(() => done())
        .catch(e => done(e))
    })

    describe('register / create', function(){
        it('', function(done){
            done(false)
        })
    })

    describe('login', function(){
        it('', function(done){
            done(false)
        })
    })

    describe('update', function(){
        it('', function(done){
            done(false)
        })
    })

    describe('delete', function(){
        it('', function(done){
            done(false)
        })
    })
})