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
    return query.none(`DROP TABLE IF EXISTS profile CASCADE`)
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
    .then(() => query.all(`SELECT id, "userId", name, status FROM profile;`)
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
        .returning(Object.keys(obj).concat('id'))
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
        authenticate(requesterId)
        .then(() => authorize(requesterId === userId))
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

const setUserStatus = (requesterId, userId, status) => (
    authenticate(requesterId)
    .then(() => authorize(requesterId === userId))
    .then(() => validate(['ONLINE', 'OFFLINE', 'INVISIBLE'].indexOf(status)>= 0))
    .then(() => query.one(SQL`
        UPDATE profile
        SET status=${status}
        WHERE "userId"=${userId}
        RETURNING id, status
    ;`))
)

module.exports = {
    init,
    drop,
    create,
    get,
    getAll,
    update,
    remove,
    of,
    setUserStatus
}