const db = require('./')
const SQL = require('sql-template-strings')

const error = e => ({
    status: 500,
    message: 'database error',
    data: e
})

function query(q){
    return db.any(query)
    .catch(e => { 
        console.log(e)
        throw error(e)
    })
}

function some(q){
    throw new Error('not implemented')
}

function none(q){
    return db.none(q)
    .catch(e => { 
        console.log(e)
        throw error(e)
    })
}

module.exports = {
    some, query, none
}