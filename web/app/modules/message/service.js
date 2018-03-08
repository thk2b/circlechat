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
            text VARCHAR(1024) NOT NULL,
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
function get(requesterId, messageId){}
/** 
 * get n messages in channel
 * if beforeId is provided, get messages posted before that message
*/
function inChannel(requesterId, channelId, n=50, beforeId){}
/** 
 * update message
*/
function update(requesterId, obj){}
/** 
 * delete message
*/
function remove(requesterId, messageId){}

module.exports = {
    init,
    drop,
    create,
    get,
    inChannel,
    update,
    remove
}