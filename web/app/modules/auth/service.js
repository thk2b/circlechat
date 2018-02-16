const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const bcrypt = require('bcrypt-as-promised')
const jwt = require('jsonwebtoken')

const config = require('../../config')
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
        bcrypt.hash(pw, 10)
            .then(hashedPw => db.one(SQL`
                INSERT INTO auth ("userId", email, pw)
                VALUES (${userId}, ${email}, ${hashedPw})
                RETURNING "userId"
            ;`))
            .then(id => resolve(id))
            .catch(e => {
                switch(e.code){
                    case '23505': // violates unique constraint
                        return reject({ code: 409, message: `user id or email already in use`})
                    case '23502': // violates null constraint
                        return reject({ code: 422, message: `incomplete credentials`})
                    default:
                        console.error(e)
                        return reject({ code: 500, message: 'internal server error', data: e})
                }
            })
    }),
    /**
     * Login a user
     */
    login: ({ userId, email, pw }) => new Promise((resolve, reject) => {
        db.one(SQL`
            SELECT "userId" as id, pw as "hashedPw" FROM auth 
            WHERE "userId"=${userId} or email=${email}
        ;`)        
        .then(({ id, hashedPw}) => {
            userId = id
            return bcrypt.compare(pw, hashedPw)
        })
        .then(() => {
            jwt.sign(userId, config.secret, (e, token) => {
                if(e) reject(e)
                resolve(token)
            })
        })
        .catch(e => reject({ code: 401, message: 'invalid credentials' }))
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