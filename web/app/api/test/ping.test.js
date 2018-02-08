const test = require('tape')
const request = require('supertest')

const server = require('../../index')

const ENDPOINT = '/api/ping/'

test('api/ping endpoint', t => {
    t.plan(2)
    request(server)
        .get(ENDPOINT)
        .expect(200)
        .expect('Content-Type', /json/)
        .end( (err, res) => {
            t.error(err)
            t.deepEqual({
                status: 'success', message: 'pong'
            }, res.body)
            t.end()    
        })
})

// test('teardown', t => {
//     server.close()
//     t.end()
// })