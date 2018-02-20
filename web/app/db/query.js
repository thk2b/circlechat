const db = require('./')
const SQL = require('sql-template-strings')

const error = e => ({
    status: 500,
    message: 'database error',
    data: e
})

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
        console.log(e)
        return Promise.reject(error(e))
    })
}

module.exports = {
    some, query, none
}