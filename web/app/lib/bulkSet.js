/**
 * 
 * @param {*} obj 
 */

module.exports = function bulkSet(obj){
    const setStatement = Object.keys(obj).map(
        (k, i) => `"${k}"=($${1+i})`
    ).join(', ')

    const values = Object.entries(obj).map(
        ([_, v]) => v
    )
    return {
        setStatement,
        values
    }
}