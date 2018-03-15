const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const bcrypt = require('bcrypt-as-promised')
const jwt = require('jsonwebtoken')

const authenticate = require('../../lib/authenticate')
const authorize = require('../../lib/authorize')
const validate = require('../../lib/validate')

const config = require('../../config')
const query = require('../../db/query')
const { service: profileService } = require('../profile')

/**
 * Create database tables
 */
function init(){
    return query.none(`
        CREATE TABLE IF NOT EXISTS auth (
            "userId" VARCHAR(30) UNIQUE NOT NULL,
            email VARCHAR(256) UNIQUE NOT NULL,
            pw VARCHAR(256) NOT NULL,
            "registeredAt" BIGINT NOT NULL,
            "lastLogoutAt" BIGINT,
            PRIMARY KEY ("userId") 
        )
    ;`)
}

/**
 * Drop database tables
 */
function drop(){
    return query.none(`DROP TABLE IF EXISTS auth CASCADE;`)
}

/**
 * Register a user
 */
function register({ userId, email, pw }){
    return validate(userId && email && pw, 'credentials')
    .then(() => bcrypt.hash(pw, 10))
    .then(hashedPw => query.none(SQL`
        INSERT INTO auth ("userId", email, pw, "registeredAt", "lastLogoutAt")
        VALUES (${userId}, ${email}, ${hashedPw}, ${Date.now()}, NULL)
        RETURNING "userId"
    ;`))
}
/**
 * Login a user
 */
function login({ userId, email, pw }){
    return new Promise((resolve, reject) => {
        const data = query.one(SQL`
            SELECT "userId" as id, pw as "hashedPw", "lastLogoutAt"
            FROM auth
            WHERE "userId"=${userId} or email=${email}
        ;`)
        const verify = data.then(({ hashedPw }) => {
            return bcrypt.compare(pw, hashedPw)
        })
        
        return Promise.all([data, verify])
        .then(([{ id, lastLogoutAt }]) => {
            jwt.sign(id, config.secret, (e, token) => {
                if(e) reject(e)
                resolve({ token, userId: id, lastLogoutAt })
            })
        })
        .catch(e => reject({ status: 401, message: 'invalid credentials' }))
    })
}
/**
 * Logout a user
 */
function logout(requesterId, userId){
    return authenticate(requesterId)
    .then(() => authorize(requesterId === userId))
    .then(() => query.one(SQL`
        UPDATE auth
        SET "lastLogoutAt" = ${Date.now()}
        WHERE "userId" = ${userId}
        RETURNING *
    ;`))
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
    .then(() => query.one(SQL`SELECT "userId", email FROM auth WHERE "userId"=${id};`))
}

function verifyPassword(userId, pw){
    return query.one(SQL`SELECT pw AS "hashedPw" FROM auth WHERE "userId"=${userId};`)
    .then(({ hashedPw }) => bcrypt.compare(pw, hashedPw))
    .catch(e => authenticate(false))
}
/**
 * change password
 */
function updatePw(requesterId, userId, { currentPw, newPw }){
    return authenticate(requesterId)
    .then(() => authorize(requesterId === userId))
    .then(() => verifyPassword(userId, currentPw))
    .then(() => bcrypt.hash( newPw, 10 ))
    .then(( hashedPw ) => query.one(SQL`
        UPDATE auth
        SET pw=${hashedPw}
        WHERE "userId"=${userId}
        RETURNING "userId"
    ;`))
}
/**
 * change email
 */
function updateEmail(requesterId, userId, { pw, newEmail } ){
    return authenticate(requesterId)
    .then(() => authorize(requesterId === userId))
    .then(() => verifyPassword(userId, pw))
    .then(() => query.one(SQL`
        UPDATE auth
        SET email=${newEmail}
        WHERE "userId"=${userId}
        RETURNING "userId", email
    ;`))   
}
/**
 * delete credentials
 */
function remove(requesterId, id){
    return authenticate(requesterId)
    .then(() => authorize(requesterId === id))
    .then(() => query.none(SQL`DELETE FROM auth WHERE "userId"=${id};`))
}

module.exports = {
    init,
    drop,
    register,
    login,
    logout,
    verifyToken,
    get,
    updateEmail,
    updatePw,
    remove
}