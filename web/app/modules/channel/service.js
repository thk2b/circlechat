const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const knex = require('knex')({ client: 'pg' })

const query = require('../../db/query')
const authorize = require('../../lib/authorize')
const authenticate = require('../../lib/authenticate')
const validate = require('../../lib/validate')

function init(){
    return query.none(`
        CREATE TABLE channel (
            id SERIAL UNIQUE NOT NULL,
            "creatorId" SERIAL NOT NULL,
            name VARCHAR(30) NOT NULL,
            "createdAt" BIGINT NOT NULL,
            "updatedAt" BIGINT NOT NULL,
            FOREIGN KEY ("creatorId") REFERENCES profile(id) ON DELETE CASCADE
        )
    ;`)
}
function drop(){
    return query.none(`DROP TABLE IF EXISTS channel`)
}
function create(){}
function get(){}
function getAll(){}
function update(){}
function remove(){}

module.exports = {
    init,
    drop,
    create,
    get,
    getAll,
    update,
    remove
}