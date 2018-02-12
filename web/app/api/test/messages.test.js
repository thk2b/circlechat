const chai = require('chai')
const { expect } = chai

chai.use(require('chai-http'))

const server = require('../../server')
const db = require('../../db')
const { create, seed, drop } = require('../../db/schema')

const ENDPOINT = '/api/messages/'

describe(`${ENDPOINT} endpoint`, function(){
    before(function(done){
        server.listen(1,() => done())
    })
    beforeEach(function(done){
        drop(db)
            .then(() => create(db))
            .then(() => done())
            .catch(e => done(e))
    })
    after(function(){
        server.close()
    })

    it('should send the messages', function(done){
        seed(db).then(data => {
            chai.request(server)
                .get(ENDPOINT)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.equal(data)
                    done()
                })
        })
    })
})