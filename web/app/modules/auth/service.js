const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const { hash } = require('bcrypt-as-promised')

const db = require('../../db')

module.exports = {
    /**
     * Create database tables
     */
    init: () => new Promise((resolve, reject) => {
        db.any(`
            CREATE TABLE auth (
                "userId" VARCHAR(256) UNIQUE NOT NULL,
                email VARCHAR(256) UNIQUE NOT NULL,
                pw VARCHAR(256) NOT NULL,
                PRIMARY KEY ("userId")
            )
        ;`)
            .then(() => resolve())
            .catch(e => reject(e))
    }),
    /**
     * Drop database tables
     */
    drop: () => new Promise((resolve, reject) => {
        db.none(`DROP TABLE IF EXISTS auth`)
            .then(() => resolve())
            .catch(e => reject(e))
    }),
    /**
     * Register a user
     */
    register: ({ userId, email, pw }) => new Promise((resolve, reject) => {
        hash(pw, 10)
            .then(hashedPw => db.one(SQL`
                INSERT INTO auth ("userId", email, pw)
                VALUES (${userId}, ${email}, ${hashedPw})
                RETURNING "userId"
            ;`))
            .then(id => resolve(id))
            .catch(e => {
                if(e.code === '23505'){
                    return reject({ code: 409, message: `userId or email already in use`})
                }
                reject(e)
            })
    }),
    /**
     * Login a user
     */
    login: ({ userId, email, pw }) => new Promise((resolve, reject) => {

    }),
    /**
     * update credentials with keys
     */
    update: ({ id, keys }) => new Promise((resolve, reject) => {
        reject(new Error('not implemented'))
    }),
    /**
     * delete credentials
     */
    delete: id => new Promise((resolve, reject) => {
        reject(new Error('not implemented'))
    })
}