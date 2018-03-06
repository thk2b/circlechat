const service = require('./service')

module.exports = function(socket, io, data){
    switch(data.action){
        case 'CREATE':
        case 'UPDATE':
        case 'DELETE':
        default:
            return
    }
}