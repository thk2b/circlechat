export default socket => store => {
    socket.on('action', action => {
        console.log('socket.on: ', action)
        if( typeof action.type !== 'undefined' ){ 
            store.dispatch(action)
        }
    })
    return next => action => {
        if( action.type === 'io' ){
            console.log('socket.emit: ')
            socket.emit(action.meta.event, action.meta.data)
        }
        return next(action)
    }
}
