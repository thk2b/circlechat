const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const knex = require('knex')({ client: 'pg' })

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
function update(requesterId, profileId, obj){
    return authenticate(requesterId)
    .then(() => query.one(knex('profile')
        .update(obj)
        .where('userId', '=', requesterId)
        .andWhere('id', '=', profileId)
        .returning('*')
        .toQuery()
    ))
    .catch(e => {
        /* if no record was updated, requesterId !== profile.userId */
        if(e.status === 404) return authorize(false)
        return Promise.reject(e)
    })
}
/** 
 * delete profile
*/
function remove(requesterId, profileId){
    return authenticate(requesterId)
    .then(() => query.one(SQL`
        DELETE FROM profile
        WHERE id=${profileId} and "userId"=${requesterId}
        RETURNING id
    ;`))
    .catch(e => {
        /* if no record was deleted, requesterId !== profile.userId */
        if(e.status === 404) return authorize(false)
        return Promise.reject(e)
    })
}

const of = {
    user: (requesterId, userId) => (
        authorize(requesterId === userId)
        .then(() => query.one(SQL`
            SELECT *
            FROM profile
            WHERE "userId"=${userId}
        ;`))
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