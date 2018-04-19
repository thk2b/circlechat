export const CONNECT = 'websocket-middleware/connect'
export const connect = token => {
    return {
        type: CONNECT,
        token
    }
}

export const DISCONNECT = 'websocket-middleware/disconnect'
export const disconnect = () => {
    return {
        type: DISCONNECT
    }
}

export const EMIT = 'websocket-middleware/emit'
export const emit = (resource, type, data, options) => {
    /* options: { resourceId } */
    if(resource && type ) return {
        type: EMIT,
        resource, data, options
    }
    console.error('invalid websocket.emit action parameters:', {
        resource, type, data, options
    })
}

export default { connect, disconnect, emit }