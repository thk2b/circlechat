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
function create(){
    return new Promise((resolve, reject) => {

    })
}
/** 
 * get profile
*/
function get(){
    return new Promise((resolve, reject) => {

    })
}
/** 
 * get all profiles
 * excludes 'description' field
*/
function getAll(){
    return new Promise((resolve, reject) => {

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