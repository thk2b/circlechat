const test = require('tape')
const request = require('supertest')

const server = require('../../index')
const db = require('../../db')

const ENDPOINT = '/api/messages/'

test('setup', t => {
    // recreate db
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

test('teardown', t => {
    // drop db
    // close server, db connection
})