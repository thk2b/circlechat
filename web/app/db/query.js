const db = require('./')
const SQL = require('sql-template-strings')

const error = e => {
    switch(e.code){
        case 0:
            return { status: 404, message: 'not found', data: e}
        case '23505': // violates unique constraint
            return { status: 409, message: 'duplicate data', data: e}
        case '23502': // violates null constraint
        case '42703': // column does not exist
            return { status: 422, message: 'incomplete or invalid data', data: e}
        default:
            return { status: 500, message: 'database error', data: e}
    }
    return {
        status: 500,
        message: 'database error',
        data: e
    }
}

function all(q){
    return db.any(q)
    .catch(e => {
        return Promise.reject(error(e))
    })
}

function one(q){
    return db.one(q)
    .catch(e => {
        return Promise.reject(error(e))
    })
}

function none(q){
    return db.any(q)
    .then(_ => Promise.resolve())
    .catch(e => {
        return Promise.reject(error(e))
    })
}

module.exports = {
    one, all, none
}