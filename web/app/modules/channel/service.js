const Promise = require('bluebird')
const SQL = require('sql-template-strings')
const knex = require('knex')({ client: 'pg' })

const query = require('../../db/query')
const authorize = require('../../lib/authorize')
const authenticate = require('../../lib/authenticate')
const validate = require('../../lib/validate')

const { service: profile } = require('../profile')

/** 
 * create table
*/
function init(){
    return query.none(`
        CREATE TABLE channel (
            id SERIAL UNIQUE NOT NULL,
            "profileId" INTEGER NOT NULL,
            name VARCHAR(30) UNIQUE NOT NULL,
            "createdAt" BIGINT NOT NULL,
            "updatedAt" BIGINT NOT NULL,
            FOREIGN KEY ("profileId") REFERENCES profile(id) ON DELETE CASCADE
        )
    ;`)
}
/** 
 * drop table
*/
function drop(){
    return query.none(`DROP TABLE IF EXISTS channel`)
}
/** 
 * create a channel
*/
function create(requesterId, { profileId, name }){
    return authenticate(requesterId)
    .then(() => validate(profileId && name))
    .then(() => profile.belongsToUser(profileId, requesterId))
    .then(authorize)
    .then(() => {
        const now = Date.now()
        return query.one(SQL`
            INSERT INTO channel ("profileId", name, "createdAt", "updatedAt")
            VALUES (${profileId}, ${name}, ${now}, ${now})
            RETURNING *
       ;`)
    })
}
/** 
 * get a channel
*/
function get(requesterId, channelId){
    return authenticate(requesterId)
    .then(() => query.one(SQL`
        SELECT * FROM channel WHERE id=${channelId}
    ;`))
}
function getAll(requesterId){
    return authenticate(requesterId)
    .then(() => query.all(`SELECT * FROM channel;`))
    .then( channels => channels.reduce(
        (obj, channel) => ({...obj, [channel.id]: channel })
    ,{}))
}

const belongsToUser = (channelId, userId) => (
    query.one(SQL`
        SELECT EXISTS (
            SELECT 1
            FROM channel JOIN profile ON profile.id=channel."profileId"
            WHERE profile."userId"=${userId} AND channel.id=${channelId}
        )
    ;`)
    .then(({exists}) => exists)
)

function update(requesterId, channelId, obj){
    return authenticate(requesterId)
    .then(() => belongsToUser(channelId, requesterId))
    .then(authorize)
    .then(() => authorize(Object.keys(obj).reduce(
        /* if object contains any of these keys, then it's invalid */
        (isValid, key) => !['id', 'profileId', 'createdAt', 'updatedAt'].includes(key)
    , true)))
    .then(() => query.one(knex('channel')
        .update({...obj, updatedAt: Date.now()})
        .where('id', '=', channelId)
        .returning(Object.keys(obj).concat('id', 'updatedAt'))
        .toQuery()
    ))
}
function remove(requesterId, channelId){
    return authenticate(requesterId)
    .then(() => belongsToUser(channelId, requesterId))
    .then(authorize)
    .then(() => query.none(SQL`
        DELETE FROM channel as c
        WHERE c.id=${channelId}
    ;`))
}

module.exports = {
    init,
    drop,
    create,
    get,
    getAll,
    belongsToUser,
    update,
    remove
}