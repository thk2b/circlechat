const chai = require('chai')
const { expect } = chai
chai.use(require("chai-as-promised"))

const authenticate = require('../authenticate')

describe('lib/authenticate', function(){
    it('should reject when condition is false', function(){
        expect(authenticate(null)).to.be.rejected
    })
    it('should reject with the correct error message when condition is false', function(){
        expect(authenticate(false)).to.be.rejectedWith(
            { message: 'unauthenticated', status: 401 }
        )
    })
    it('resolve when the condition is true', function(){
        expect(authenticate(true)).to.eventually.equal()
    })
    
})