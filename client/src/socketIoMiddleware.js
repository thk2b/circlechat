import { addMessage } from './messages/actions'
import { updateOnlineUsersCount, updateConnectionsCount } from './usersStats/actions'

export default socket => store => {
    socket.on('CONNECT_SUCCESS', console.log)
    
    socket.on('UPDATE_ONLINE_USERS_COUNT', count => store.dispatch(updateOnlineUsersCount(count)))
    socket.on('UPDATE_CONNECTIONS_COUNT', count => store.dispatch(updateConnectionsCount(count)))

    socket.on('ADD_MESSAGE', json => {
        const { message } = JSON.parse(json)
        store.dispatch(addMessage(message))
    })

    return next => action => {
        if( action.type === 'io' ){
            socket.emit(action.meta.event, action.data)
        }
        return next(action)
    }
}
