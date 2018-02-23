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
    // error
    '/profile'
    // 'message',
]

export default (connect, url) => store => next => action => {
    if(action.network !== 'ws') return next(action)

    let socket
    if(action.type === 'connect' && !action.status){
        const token = store.getState().auth.token
        if(!token){ return console.error('cannot connect to websocket without a token') }

        socket = connect(url, {
            query: 'token='+token
        })

        socket.once('connect', () => {
            process.env.NODE_ENV === 'development' && console.log('socket connected')
            store.dispatch({
                ...action, status: 201
            })
        })
        socket.on('disconnect', () => {
            console.error('socket disconected')
        })
        
        resources.forEach(
            resource => socket.on(resource, handle(resource, store.dispatch))
        )
    }

    if(action.status === undefined){ /* outgoing */
        if(validateOutgoingNetworkAction(action)){
            process.env.NODE_ENV === 'development' && console.log('outgoing ws message: ', action)

            const meta = action.resourceId? { resourceId: action.resourceId } : {}

            const payload = {
                data: action.data, 
                meta: { ...meta, type: action.type }
            }
            socket && socket.emit(action.resource, payload)
        } else {
            console.error('invalid outgoing network action: ', action)
        }
    }
    return next(action)
}
