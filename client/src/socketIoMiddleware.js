import validateOutgoingNetworkAction from './lib/validateOutgoingNetworkAction'
// import { addMessage } from './messages/actions'

// const events = {
//     'UPDATE_ONLINE_USERS_COUNT': updateOnlineUsersCount,
//     'UPDATE_CONNECTIONS_COUNT': updateConnectionsCount,
//     'ADD_MESSAGE': addMessage
// }

export default socket => store => {
    // Object.entries(events).forEach(
    //     ([event, action]) => socket.on(event, data => {
    //         process.env.NODE_ENV === 'development' && console.log({ event, data })
    //         store.dispatch(action(data))
    //     })
    // )
    
    return next => action => {
        if(action.network === 'ws'){
            if(validateOutgoingNetworkAction(action)){
                process.env.NODE_ENV === 'development' && console.log({ws: action})

                const payload = {...action.payload, type: action.type}
                socket.emit(action.url, payload)
            } else {
                console.error('invalid outgoing network action: ', action)
            }
        }
        return next(action)
    }
}
