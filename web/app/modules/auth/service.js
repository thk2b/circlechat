const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const bcrypt = require('bcrypt-as-promised')
const jwt = require('jsonwebtoken')

const bulkSet = require('../../lib/bulkSet')

const config = require('../../config')
const db = require('../../db')

/**
 * Create database tables
 */
function init(){
    return db.any(`
        CREATE TABLE auth (
            "userId" VARCHAR(30) UNIQUE NOT NULL,
            email VARCHAR(256) UNIQUE NOT NULL,
            pw VARCHAR(256) NOT NULL,
            PRIMARY KEY ("userId")
        )
    ;`)
}

/**
 * Drop database tables
 */
function drop(){
    return db.none(`DROP TABLE IF EXISTS auth CASCADE;`)
}

/**
 * Register a user
 */
function register({ userId, email, pw }){
    return new Promise((resolve, reject) => {
        if(! userId || !email || !pw){
            return reject({ status: 422, message: `incomplete credentials`})
        }
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
                    return reject({ status: 409, message: `user id or email already in use`})
                case '23502': // violates null constraint
                    return reject({ status: 422, message: `incomplete credentials`})
                default:
                    console.error(e)
                    return reject({ status: 500, message: 'internal server error', data: e})
            }
        })
    })
}

/**
 * Login a user
 */
function login({ userId, email, pw }){
    return new Promise((resolve, reject) => {
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
        .catch(e => reject({ status: 401, message: 'invalid credentials' }))
    })
}

function verifyToken(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (e, decodedToken) => {
            if(e) reject({ status: 401, message: 'invalid token'})
            resolve(decodedToken)
        })
    })
}

/**
 * Get user with id
 */
function get(requesterId, id){
    return new Promise((resolve, reject) => {
        if(requesterId === null){
            return reject({ status: 401, message: 'unauthorized' })
        }
        if(requesterId !== id){
            return reject({ status: 403, message: 'not permitted' })
        }
        db.one(SQL`SELECT "userId", email FROM auth WHERE "userId"=${id};`)
        .then(data => resolve(data))
        .catch(e => reject({ status: 404, message: 'user not found'}))
    })
}

// function updatePw(id, newPw){
//     return new Promise((resolve, reject) => {
//         bcrypt.hash(newPw, 10)
//         .then(hashedPw => db.one(SQL`
//             UPDATE auth 
//             SET pw=${hashedPw}
//             WHERE "userId"=${id};`))
//         .then(() => resolve(id))
//         .catch(e => reject(e))
//     })
// }
/**
 * update credentials with keys
 */
function update(id, obj){
    // // check object: do not update userId; hash new pw.
    // if(obj['userId'] !== undefined){
    //     delete obj['userId']
    // }
    // let updatingPwPromise = undefined
    // if(obj['pw'] !== undefined){
    //     updatingPwPromise = updatePw(id, obj['pw'])
    //     delete obj['pw']
    // }

    // const { setStatement, values } = bulkSet(obj)
    // values.push(id)
    // const query = `
    //     UPDATE auth 
    //     SET ${setStatement} 
    //     WHERE "userId"=($${values.length}) 
    //     RETURNING *
    // ;`
    // console.log(query)
    // if(updatingPwPromise){
    //     return Promise.all(
    //         updatingPwPromise,
    //         db.any(query, values)
    //     )
    // } else return db.any(query, values)
    // // .then(data => console.log(data))
    return new Promise((resolve, reject) => {
        reject(new Error('not implemented'))
    })
}

/**
 * delete credentials
 */
function remove(requesterId, id){
    return new Promise((resolve, reject) => {
        if(requesterId === null){
            return reject({ status: 401, message: 'unauthorized' })
        }
        if(requesterId !== id){
            return reject({ status: 403, message: 'not permitted' })
        }
        return resolve(db.any(SQL`DELETE FROM auth WHERE "userId"=${id}`))
    })
}

module.exports = {
    init,
    drop,
    register,
    login,
    verifyToken,
    get,
    update,
    remove
}