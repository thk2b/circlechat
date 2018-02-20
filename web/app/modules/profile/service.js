const Promise = require('bluebird')
const SQL = require('sql-template-strings')

const query = require('../../db/query')
const authorize = require('../../lib/authorize')
const authenticate = require('../../lib/authenticate')
const validate = require('../../lib/validate')

/** 
 * create table
*/
function init(){
    return query.none(`
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
    return query.none(`DROP TABLE IF EXISTS profile`)
}
/** 
 * create profile
*/
function create(requesterId, { userId, name=userId, description='', status='ONLINE' }){
    return validate(userId)
    .then(() => authenticate(requesterId))
    .then(() => authorize(requesterId === userId))
    .then(() => query.one(SQL`
        INSERT INTO profile ("userId", name, description, status)
        VALUES (${userId}, ${name}, ${description}, ${status})
        RETURNING *
    ;`))
}
/** 
 * get profile
*/
function get(requesterId, profileId){
    return query.one(SQL`
        SELECT * FROM profile
        WHERE id=${profileId}
    ;`)
}
/** 
 * get all profiles
*/
function getAll(requesterId){
    return authenticate(requesterId)
    .then(() => query.all(`SELECT * FROM profile;`)
    .then(profiles => profiles.reduce(
        (obj, profile) => ({...obj, [profile.id]: profile})
    , {})))
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
    .then(() => query.none(SQL`
        DELETE FROM profile
        WHERE id=${profileId} and "userId"=${requesterId}
    ;`))
}

const of = {
    user: (requesterId, userId) => (
        authorize(requesterId === userId)
        .then(() => query.one(SQL`
            SELECT *
            FROM profile
            WHERE "userId"=${userId}
        ;`))
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