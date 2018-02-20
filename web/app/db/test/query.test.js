const SQL = require('sql-template-strings')
const chai = require('chai')
const { expect } = chai
chai.use(require("chai-as-promised"))

const db = require('../')
const { some, query, none } = require('../query')

before(function(){
    return db.any(`
        CREATE TABLE test (
            a INTEGER, b VARCHAR(5)
        )
    ;`)
    .then(() => db.any(`
        INSERT INTO test (a, b)
        VALUES
        (1, 'hello'),
        (2, 'bye')
    ;`))
})

after(function(){
    return db.any(`DROP TABLE test;`)
})

describe('lib/query/some', function(){
    it.skip('should return some record', function(){
        return some(`SELECT * FROM test;`)
        .then(data => expect(data).to.deep.equal({a: 1, b: 'hello'}))
    })
    it.skip('should throw an error if no record was found', function(){
        return expect(some(`SELECT * FROM nowhere;`)).to.be.rejectedWith({ status: 404, mesage: 'not found'})
    })
    it.skip('should throw a standard error', function(){
        return expect(some(`SELECT * FROM nowhere;`)).to.be.rejectedWith({ code: 500, message: 'database error'})
    })
})
describe('lib/query/all', function(){
    it('should return all records', function(){
        return query(`SELECT * FROM test;`)
        .then(data => expect(data).to.deep.equal([{a: 1, b: 'hello'}, {a: 2, b: 'bye'}]))
    })
    it('should throw a standard error', function(){
        return expect(query(`SELECT * FROM nowhere;`)).to.be.rejected
    })
})
describe('lib/query/none', function(){
    it('should return no records;', function(){
        return none(`SELECT * FROM test;`)
        .then(data => expect(data).to.deep.equal())
    })
    it('should throw a standard error', function(){
        return expect(none(`SELECT * FROM nowhere;`)).to.be.rejected
    })
})