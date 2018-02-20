const db = require('./')
const SQL = require('sql-template-strings')

const error = e => {
    switch(e.code){
        case '42P01':
            return { status: 404, message: 'not found'}
        case '23505': // violates unique constraint
            return { status: 409, message: 'duplicate data'}
        case '23502': // violates null constraint
            return { status: 422, message: 'incomplete data'}
        default:
            return { status: 500, message: 'database error', data: e}
    }
    return {
        status: 500,
        message: 'database error',
        data: e
    }
}

function query(q){
    return db.any(q)
    .catch(e => {
        return Promise.reject(error(e))
    })
}

function some(q){
    return db.any(q)
    .then(data => {
        if(!data) return Promise.reject({ status: 404, message: 'not found'})
        return data
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
    some, query, none
}