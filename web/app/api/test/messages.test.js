const test = require('tape')
const request = require('supertest')

const server = require('../../index')
const db = require('../../db')
const create = require('../../db/create')
const seed = require('../../db/seed')
const drop = require('../../db/drop')

const ENDPOINT = '/api/messages/'

test('setup', t => {
    drop(db)
    .then(() => create(db))
    .then(() => seed(db))
    .then(() => t.end())
    .catch(e => t.fail(`failed to setup: ${e}`))
})

test(`${ENDPOINT} endpoint`, t => {
    t.plan(2)
    request(server)
        .get(ENDPOINT)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            t.error(err)
            t.deepEqual({}, res.body)
            t.end()
        })
})

// test('teardown', t => {
//     drop(db)
//     t.end()
// })