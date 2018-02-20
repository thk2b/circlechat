const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const bcrypt = require('bcrypt-as-promised')
const jwt = require('jsonwebtoken')

const bulkSet = require('../../lib/bulkSet')
const authenticate = require('../../lib/authenticate')
const authorize = require('../../lib/authorize')
const validate = require('../../lib/validate')

const config = require('../../config')
const db = require('../../db')
const { query, none, some } = require('../../db/query')
const { service: profileService } = require('../profile')

/**
 * Create database tables
 */
function init(){
    return query(`
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
    return none(`DROP TABLE IF EXISTS auth CASCADE;`)
}

/**
 * Register a user
 */
function register({ userId, email, pw }, createProfile=true){
    return validate(userId && email && pw, 'credentials')
    .then(() => bcrypt.hash(pw, 10))
    .then(hashedPw => query(SQL`
        INSERT INTO auth ("userId", email, pw)
        VALUES (${userId}, ${email}, ${hashedPw})
        RETURNING "userId"
    ;`))
    .then(() => createProfile && profileService.create(userId, { userId }))
}

/**
 * Login a user
 */
function login({ userId, email, pw }){
    return new Promise((resolve, reject) => {
        const data = query(SQL`
            SELECT "userId" as id, pw as "hashedPw"
            FROM auth
            WHERE "userId"=${userId} or email=${email}
        ;`)
        const verify = data.then(([{ hashedPw }]) => {
            return bcrypt.compare(pw, hashedPw)
        })
        
        return Promise.all([data, verify])
        .then(([[{ id }]]) => {
            jwt.sign(id, config.secret, (e, token) => {
                if(e) reject(e)
                resolve({ token, userId: id })
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
    return authenticate(requesterId)
    .then(() => authorize(requesterId === id))
    .then(() => db.one(SQL`SELECT "userId", email FROM auth WHERE "userId"=${id};`)
    .catch(e => Promise.reject({ status: 404, message: 'user not found'})))
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
    return authenticate(requesterId)
    .then(() => authorize(requesterId === id))
    .then(() => db.any(SQL`DELETE FROM auth WHERE "userId"=${id};`)
    .catch(e => Promise.reject({ status: 500, message: 'database error', data: e})))
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