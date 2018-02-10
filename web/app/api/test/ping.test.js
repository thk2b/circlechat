const chai = require('chai')
const { expect } = chai
chai.use(require('chai-http'))

const server = require('../../server')

const ENDPOINT = '/api/ping/'

describe('api/ping endpoint', function(){
    before(function(done){
        server.listen(2,() => done())
    })
    after(function(){
        server.close()
    })
    it('should send the success message', function(done){
        chai.request(server)
            .get(ENDPOINT)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.header('content-type', /json/)
                expect(res).to.have.status(200)
                expect(res.body).to.deep.equal({
                    status: 'success', message: 'pong'
                })
                done()
            })
    })
})