const chai = require('chai')
const { expect } = chai
chai.use(require("chai-as-promised"))

const authorize = require('../authorize')

describe('lib/authorize', function(){
    it('should reject when condition is false', function(){
        expect(authorize(false, 'test')).to.be.rejected
    })
    it('should reject with the correct error message when condition is false', function(){
        expect(authorize(false, 'test')).to.be.rejectedWith(
            { message: 'test', status: 403 }
        )
    })
    it('resolve when the condition is true', function(){
        expect(authorize(true, 'test')).to.eventually.equal()
    })
    
})