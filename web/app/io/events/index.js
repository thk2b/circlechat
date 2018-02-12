const path = require('path')

/* register event names here */
const events = [
    'connection',
    'disconnect',
    'SUBMIT_MESSAGE'
]

/* Export an object whose keys are an event name,
** and whose values are an event handler 
** defined in a module of the same name, in lower case, saved in this directory. 
** Event handlers have the signature (socket, io, data) => {...}.
*/

try {
    module.exports = events.reduce(
        (obj, event) => {
            return Object.assign(obj, {
                [event]: require(path.join(__dirname, event.toLowerCase())) 
            })
        }
    ,{})
} catch(e) {
    console.error('error: could not gather events: ', e)
}