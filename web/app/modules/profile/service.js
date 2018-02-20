const Promise = require('bluebird')
const SQL = require('sql-template-strings')

const db = require('../../db')
const authorize = require('../../lib/authorize')
const authenticate = require('../../lib/authenticate')
const validate = require('../../lib/validate')

/** 
 * create table
*/
function init(){
    return db.any(`
        CREATE TABLE profile (
            id SERIAL UNIQUE NOT NULL,
            "userId" VARCHAR(256) UNIQUE NOT NULL,
            name VARCHAR(30) NOT NULL,
            description VARCHAR(512) NOT NULL,
            status VARCHAR(25),
            PRIMARY KEY (id),
            FOREIGN KEY ("userId") REFERENCES auth("userId") ON DELETE CASCADE
        )
    ;`)
}
/** 
 * drop table
*/
function drop(){
    return db.none(`DROP TABLE IF EXISTS profile`)
}
/** 
 * create profile
*/
function create(requesterId, { userId, name=userId, description='', status='ONLINE' }){
    return validate(userId)
    .then(() => authenticate(requesterId))
    .then(() => authorize(requesterId === userId))
    .then(() => db.one(SQL`
        INSERT INTO profile ("userId", name, description, status)
        VALUES (${userId}, ${name}, ${description}, ${status})
        RETURNING *
    ;`))
    .catch(e => Promise.reject(e.status? e : { status: 500, message: 'database error', data: e}))
}
/** 
 * get profile
*/
function get(requesterId, profileId){
    return db.one(SQL`
        SELECT * FROM profile
        WHERE id=${profileId}
    ;`)
    .catch(e => {
        if(e.code === 0){
            return Promise.reject({ status: 404, message: 'not found'})
        }
        return Promise.reject({ status: 500, message: 'internal server error'})
    })
}
/** 
 * get all profiles
*/
function getAll(requesterId){
    return authenticate(requesterId)
    .then(() => db.any(`SELECT * FROM profile;`)
    .then(profiles => profiles.reduce(
        (obj, profile) => ({...obj, [profile.id]: profile})
    , {})))
    .catch(e => Promise.reject(e.status? e : { status: 500, message: 'database error'}))
}
/** 
 * update profile
*/
function update(){
    return new Promise((resolve, reject) => {
        reject(new Error('not implemented'))
    })
}
/** 
 * delete profile
*/
function remove(requesterId, profileId){
    return authenticate(requesterId)
    .then(() => db.none(SQL`
        DELETE FROM profile
        WHERE id=${profileId} and "userId"=${requesterId}
    ;`))
    .catch(e => Promise.reject(e.status? e : { status: 500, message: 'database error'}))
}

const of = {
    user: (requesterId, userId) => (
        authorize(requesterId === userId)
        .then(() => db.one(SQL`
            SELECT *
            FROM profile
            WHERE "userId"=${userId}
        ;`))
        .catch(e => Promise.reject(e.status? e : { code: 500, message: 'database error', data: e}))
    )
}

module.exports = {
    init,
    drop,
    create,
    get,
    getAll,
    update,
    remove,
    of
}