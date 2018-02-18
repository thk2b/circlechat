const SQL = require('sql-template-strings')

const db = require('../../db')

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
            FOREIGN KEY ("userId") REFERENCES auth("userId")
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
    return new Promise((resolve, reject) => {
        if(!userId){
            return reject({ status: 422, message: 'invalid data' })
        }
        if(requesterId === null){
            return reject({ status: 401, message: 'unauthorized' })
        }
        if(requesterId !== userId){
            return reject({ status: 403, message: 'not permitted' })
        }
        return resolve(db.one(SQL`
            INSERT INTO profile ("userId", name, description, status)
            VALUES (${userId}, ${name}, ${description}, ${status})
            RETURNING *
        ;`))
    })
}
/** 
 * get profile
*/
function get(requesterId, profileId){
    return new Promise((resolve, reject) => {
        db.one(SQL`
            SELECT * FROM profile
            WHERE id=${profileId}
        ;`).then( data => resolve(data))
        .catch(e => {
            if(e.code === 0){
                reject({ status: 404, message: 'not found'})
            }
            reject({ status: 500, message: 'internal server error'})
        })
    })
}
/** 
 * get all profiles
 * excludes 'description' field
*/
function getAll(requesterId){
    return new Promise((resolve, reject) => {
        if(requesterId === null){
            return reject({ status: 401, message: 'unauthorized' })
        }
        return resolve(
            db.any(`SELECT * FROM profile;`)
            .then(profiles => profiles.reduce(
                (obj, profile) => ({...obj, [profile.id]: profile})
            , {}))
        )
    })
}
/** 
 * update profile
*/
function update(){
    return new Promise((resolve, reject) => {

    })
}
/** 
 * delete profile
*/
function remove(){
    return new Promise((resolve, reject) => {

    })    
}

module.exports = {
    init, drop, create, get, getAll, update, remove
}