import { addMessage } from './messages/actions'

export default socket => store => {
    socket.on('CONNECT_SUCCESS', console.log)
    
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
