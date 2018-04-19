import actions, { CONNECT, DISCONNECT, EMIT } from './actions'

import handlers from './handlers'

export { actions as websocketActions }

let socket
export default (openConnection, url) => store => next => action => {
    if(action.type === CONNECT){
        const token = action.token||store.getState().auth.token
        if(!token){
            return console.error('cannot connect to websocket without a token')
        }

        socket = openConnection(url, {
            query: 'token='+token
        })

        socket.once('connect', () => {
            process.env.NODE_ENV === 'development' && console.log('socket connected')
        })
        socket.on('disconnect', () => {
            console.error('socket disconected')
        })
        
        Object.entries(handlers).forEach(
            ([ event, handler ]) => socket.on(event, payload => {
                handler(payload, store)
            })
        )
    }
    else if(action.type === DISCONNECT){
        socket && socket.close()
    }
    else if(action.type === EMIT){
        const { resource, type, data, options } = action
        const payload = {
            data: action.data, 
            meta: { ...options, type }
        }
        socket.emit(resource, payload)
        process.env.NODE_ENV === 'development'
            && console.log('outgoing ws message: ', action)
    }
    next(action)
}