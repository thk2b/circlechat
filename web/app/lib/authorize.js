module.exports = function(condition){
    if(condition) return Promise.resolve()
    else return Promise.reject({ status: 403, message: 'unauthorized' })
}