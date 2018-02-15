const Promise = require('bluebird')
const SQL = require('sql-template-strings')

const db = require('../../db')

module.exports = {
    /**
     * Create database tables
     */
    init: () => new Promise((resolve, reject) => {
        db.any(`
            CREATE TABLE "user" (
                id SERIAL NOT NULL,
                name VARCHAR(256) NOT NULL,
                email VARCHAR(256) NOT NULL,
                pw VARCHAR(256) NOT NULL,
                PRIMARY KEY (id)
            )
        ;`).then(() => resolve())
        .catch(e => reject(e))
    }),
    /**
     * Create a user
     */
    create: ({ id, name, email, pw }) => new Promise((resolve, reject) => {
        //TODO: hash pw
        db.any(SQL`
            INSERT INTO "user" (id, name, email, pw)
            VALUES (${id}, ${name}, ${email}, ${pw})
            RETURNING *
        ;`)
        .then(user => resolve(user))
        .catch(e => reject(e))
    }),
    /**
     * Get all users
     */
    all: () => new Promise((resolve, reject) => {
        db.any(`SELECT * FROM "user";`)
        .then(users => resolve(users))
        .catch(e => reject(e))
    }),
    /**
     * get a user
     */
    get: id => new Promise((resolve, reject) => {
        db.any(SQL`
            SELECT * FROM "user" 
            WHERE id=${id}
        ;`)
        .then(user => resolve(user))
        .catch(e => reject(e))
    }),
    /**
     * update a a user with keys
     */
    update: ({ id, keys }) => new Promise((resolve, reject) => {

    }),
    /**
     * delete a user
     */
    delete: id => new Promise((resolve, reject) => {

    }),
    drop: () => new Promise((resolve, reject) => {
        db.none(`DROP TABLE IF EXISTS "user"`)
        .then(() => resolve())
        .catch(e => reject(e))
    })
}