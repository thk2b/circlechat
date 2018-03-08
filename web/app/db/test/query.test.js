const SQL = require('sql-template-strings')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-as-promised'))
chai.use(require('chai-subset'))

const db = require('../')

const { one, all, none, many } = require('../query')

before(function(){
    return db.any(`DROP TABLE IF EXISTS test; DROP TABLE IF EXISTS test2;`) 
    .then(() => db.any(`
        CREATE TABLE IF NOT EXISTS test (
            a INTEGER, b VARCHAR(5)
        )
    ;`))
    .then(() => db.any(`
        INSERT INTO test (a, b)
        VALUES
        (1, 'hello'),
        (2, 'bye')
    ;`))
    .then(() => db.any('CREATE TABLE IF NOT EXISTS test2 ();'))
})

after(function(){
    return db.any(`DROP TABLE test; DROP TABLE test2;`)
})

describe('lib/query/one', function(){
    it('should throw an error if more than one records are found', function(){
        return one(`SELECT * FROM test;`)
        .then(() => { throw new Error('should not resolve')})
        .catch(e => expect(e).to.containSubset({ status: 500, message: 'database error'}))
    })
    it('should throw a standard error', function(){
        // expect(one(`SELECT * FROM nowhere;`)).to.be.rejectedWith({ status: 500, message: 'database error'})
        return one(`SELECT * FROM nowhere;`)
        .then(() => { throw new Error('should not resolve')})
        .catch(e => expect(e).to.containSubset({ status: 500, message: 'database error'}))
    })
    it('should throw a 404 when no record is found', function(){
        return one(`SELECT * FROM test2;`)
        .then(() => { throw new Error('should not resolve')})
        .catch(e => expect(e).to.containSubset({ status: 404, message: 'not found'}))
        // return expect(one(`SELECT * FROM test2;`)).to.be.rejectedWith({ status: 0, message: 'database error'})
    })
    it('should return records', function(){
        return one(SQL`SELECT * FROM test WHERE a=${1};`)
        .then(data => expect(data).to.deep.equal({a: 1, b: 'hello'}))
    })
})
describe('lib/query/all', function(){
    it('should return records', function(){
       return all(`SELECT * FROM test;`)
        .then(data => expect(data).to.deep.equal([{a: 1, b: 'hello'}, {a: 2, b: 'bye'}]))
    })
    it('should work with sql-template-strings ', function(){
       return all(SQL`SELECT * FROM test WHERE a=${1};`)
        .then(data => expect(data).to.deep.equal([{a: 1, b: 'hello'}]))
    })
    it('should throw a standard error', function(){
        expect(all(`SELECT * FROM nowhere;`)).to.be.rejected
    })
})
describe('lib/query/none', function(){
    it('should return no records;', function(){
        return none(`SELECT * FROM test;`)
        .then(data => expect(data).to.deep.equal(undefined))
    })
    it('should throw a standard error', function(){
        expect(none(`SELECT * FROM nowhere;`)).to.be.rejected
    })
})
describe('lib/query/many', function(){
    before(function(){
        return db.none(`CREATE TABLE many(
            id SERIAL, a INTEGER
        );`)
        .then(() => db.none(SQL`
            INSERT INTO many (a) VALUES (100), (200), (300);
        `))
    })
    after(function(){
        return db.none(`DROP TABLE IF EXISTS many`)
    })
    it('should resolve with an object with ids as keys', function(){
        return many('SELECT * FROM many')
        .then( data => expect(data).to.deep.equal({
            1: {id: 1, a: 100}, 
            2: {id: 2, a: 200}, 
            3: {id: 3, a: 300}
        }))
    })
})