import validateOutgoingNetworkAction from '../lib/validateOutgoingNetworkAction'

const handle = dispatch => ({ meta, data }) => {
    const action = {
        // ...meta
        resource: meta.resource,
        type: meta.type,
        status: meta.status,
        data: data
    }
    console.log('incoming socketio event: ', action)
    dispatch(action)
}

const resources = [
    // 'message', 
    // 'user'
]

export default socket => store => {
    
    resources.forEach(
        resource => socket.on(resource, handle(store.dispatch))
    )

    return next => action => {
        if(action.network === 'ws'){
            if(validateOutgoingNetworkAction(action)){
                process.env.NODE_ENV === 'development' && console.log({ws: action})

                const payload = {
                    data: action.data, 
                    meta: { type: action.type }
                }
                socket.emit(action.resource, payload)
            } else {
                console.error('invalid outgoing network action: ', action)
            }
        }
        return next(action)
    }
}
