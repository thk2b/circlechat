const chai = require('chai')
const { expect } = chai

const { recreate } = require('../../../manage')
const db = require('../../../db')

const service = require('../service')

describe('profile table', function(){
    it('should create and drop profile table', function(){
        return service.drop()
        .then(() => service.init())
        .then(() => db.one('SELECT EXISTS (SELECT 1 FROM profile)'))
        .then(({ exists }) => expect(exists).to.be.false)
    })
})

// describe('profile service', function(){
//     before(function(){
//         return recreate()
//     })
//     describe('', function(){
//         it('', function(){
    
//         })
//     })
    
//     describe('', function(){
//         it('', function(){
    
//         })
//     })
// })