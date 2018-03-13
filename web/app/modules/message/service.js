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
        CREATE TABLE IF NOT EXISTS message (
            id SERIAL,
            "profileId" INTEGER NOT NULL,
            "channelId" INTEGER NOT NULL,
            text VARCHAR(1024),
            "createdAt" BIGINT NOT NULL,
            "updatedAt" BIGINT NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY ("profileId")
                REFERENCES profile(id) ON DELETE CASCADE,
            FOREIGN KEY ("channelId")
                REFERENCES channel(id) ON DELETE CASCADE
        )
    ;`)
}
/**
 * drop table
*/
function drop(){
    return query.none(`DROP TABLE IF EXISTS message CASCADE`)
}
/** 
 * create message
*/
function create(requesterId, { profileId, channelId, text }){
    return authenticate(requesterId)
    .then(() => validate(profileId && channelId && text))
    .then(() => profile.belongsToUser(profileId, requesterId))
    .then(authorize)
    .then(() => {
        const now = Date.now()
        return query.one(SQL`
            INSERT INTO message ("profileId", "channelId", text, "createdAt", "updatedAt")
            VALUES (${profileId}, ${channelId}, ${text}, ${now}, ${now})
            RETURNING *
        ;`)
    })
}
/** 
 * get message with id
*/
function get(requesterId, messageId){
    return authenticate(requesterId)
    .then(() => query.one(SQL`
        SELECT * FROM message
        WHERE "id"=${messageId}
    ;`))
}
/** 
 * get n messages in each channel
*/
function getAll(requesterId, n=50){
    return authenticate(requesterId)
    .then(() => query.many(SQL`
        SELECT m.* FROM channel
        JOIN LATERAL (
            SELECT * FROM message
            WHERE message."channelId" = channel.id
            ORDER BY id DESC
            LIMIT ${n}
        ) AS m ON true;
    `))
}
/** 
 * get n messages in channel
 * if beforeId is provided, get messages posted before that message
*/
function inChannel(requesterId, channelId, n=50, beforeId){
    return authenticate(requesterId)
    .then(() => {
        const q = SQL`
            SELECT * FROM message
            WHERE "channelId"=${channelId}
        `
        if(beforeId) q.append(SQL`AND id < ${beforeId}`)
        q.append(SQL`
            ORDER BY id DESC
            LIMIT ${n}
        `)
        return q
    })
    .then(query.many)
}
/**
 * wether the message was posted by the user
 * @param {*} messageId 
 * @param {*} requesterId 
 */
function belongsToUser(messageId, userId){
    return query.one(SQL`
        SELECT EXISTS (
            SELECT 1
            FROM message JOIN profile ON profile.id=message."profileId"
            WHERE profile."userId"=${userId} AND message.id=${messageId}
        )
    ;`)
    .then(({exists}) => exists)
}
/** 
 * update message
*/
function update(requesterId, messageId, obj){
    return authenticate(requesterId)
    .then(() => belongsToUser(messageId, requesterId))
    .then(authorize)
    .then(() => authorize(Object.keys(obj).reduce(
        /* if object contains any of these keys, then it's invalid */
        (isValid, key) => !['id', 'profileId', 'channelId', 'createdAt', 'updatedAt'].includes(key)
    , true)))
    .then(() => query.one(knex('message')
        .update({...obj, updatedAt: Date.now()})
        .where('id', '=', messageId)
        .returning(Object.keys(obj).concat('id', 'updatedAt'))
        .toQuery()
    ))
}
/** 
 * delete message
*/
function remove(requesterId, messageId){
    return authenticate(requesterId)
    .then(() => belongsToUser(messageId, requesterId))
    .then(authorize)
    .then(() => update(requesterId, messageId, {
        text: null
    }))
}

module.exports = {
    init,
    drop,
    create,
    get,
    getAll,
    inChannel,
    belongsToUser,
    update,
    remove
}