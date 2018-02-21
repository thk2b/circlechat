import validateOutgoingNetworkAction from '../lib/validateOutgoingNetworkAction'

const handle = (resource, dispatch) => ({ meta, data }) => {
    const action = {
        resource,
        network: 'ws',
        type: meta.type,
        status: meta.status,
        data
    }
    process.env.NODE_ENV === 'development' && console.log('incoming ws message: ', action)
    dispatch(action)
}

const resources = [
    '/auth',
    // '/profile'
    // 'message',
]

export default socket => store => {
    
    resources.forEach(
        resource => socket.on(resource, handle(resource, store.dispatch))
    )

    return next => action => {
        if(action.network !== 'ws') return next(action)
        if(action.status === undefined){ /* outgoing */
            if(validateOutgoingNetworkAction(action)){
                process.env.NODE_ENV === 'development' && console.log('outgoing ws message: ', action)

                const meta = action.resourceId? { resourceId: action.resourceId } : {}

                const payload = {
                    data: action.data, 
                    meta: { ...meta, type: action.type }
                }
                socket.emit(action.resource, payload)
            } else {
                console.error('invalid outgoing network action: ', action)
            }
        }
        return next(action)
    }
}
