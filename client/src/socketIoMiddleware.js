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
    //     if( action.type === 'io' ){
    //         process.env.NODE_ENV === 'development' && console.log({ event: action.meta.event, data: action.data })
    //         socket.emit(action.meta.event, action.data)
    //     }
        return next(action)
    }
}
