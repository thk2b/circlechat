const chai = require('chai')
const { expect } = chai
chai.use(require("chai-as-promised"))

const validate = require('../validate')

describe('lib/validate', function(){
    it('should reject when condition is false', function(){
        expect(validate(false)).to.be.rejected
    })
    it('should reject with the correct error message when condition is false', function(){
        expect(validate(false, 'name')).to.be.rejectedWith(
            { message: 'invalid name', status: 4022 }
        )
    })
    it('resolve when the condition is true', function(){
        expect(validate(true)).to.eventually.equal()
    })
})