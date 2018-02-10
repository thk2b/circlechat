const path = require('path')

try {
    module.exports = [
        'disconnect',
        'SUBMIT_MESSAGE'
    ].reduce(
        (obj, event) => Object.assign(obj, {[event]: require(path.join(__dirname, event.toLowerCase())) })
    ,{})
} catch(e) {
    console.error('error: could not gather events: ', e)
}