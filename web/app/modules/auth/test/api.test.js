const chai = require('chai')
const { expect } = chai

chai.use(require('chai-http'))

const server = require('../../../server')
const db = require('../../../db')

const { recreate } = require('../../../manage')

const API_URL = ''

describe(API_URL, function(){
    before(function(done){
        server.listen(1, () => done())
    })

    beforeEach(function(done){
        recreate()
        .then(() => done())
        .catch(e => done(e))
    })

    describe(`POST ${API_URL}/`, function(){
        it('', function(done){
            done(false)        
        })
    })

    describe(`POST ${API_URL}/:id/`, function(){
        it('', function(done){
            done(false)
        })
    })

    describe(`PUT ${API_URL}/:id`, function(){
        it('', function(done){
            done(false)
        })
    })
})

