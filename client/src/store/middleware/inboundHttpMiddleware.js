import { messagesActions } from '../modules/messages'

export default ({ getState, dispatch }) => next => action => {
    if(action.network !== 'http' || action.status === undefined){
        return next(action)
    }
    
    if(action.status >= 400){
        if(action.resource === '/channel'){
            dispatch(errorActions.update('channels', errs => ({
                ...errs, 
                [action.params.id]: action.data
            })))
        } else if (action.resource === '/channel/all'){
            dispatch(errorActions.update('channels', errs => ({
                ...errs, 
                all: action.data
            })))
        }
    } else if(action.status <= 300 ){
        if(action.resource === '/messages'){
            switch(action.method){
                case 'POST':
                    dispatch(messagesActions.set(action.data.id, action.data))
                    // remove loading status
                    break
                case 'GET':
                    return dispatch(messagesActions.set(action.data.id, action.data))
                case 'PUT':
                    return dispatch(messagesActions.update(action.params.id,
                        msg => ({ ...ms, ...action.data })
                    ))
                case 'DELETE':
                    return dispatch(messagesActions.delete(action.params.id))
            }
        }
        switch(action.resource){
            case '/messages':
                
                if(action.params.channelId){
                    dispatch(channelActions.set(action.params.channelId, action.data.hasMore))
                }
                dispatch(messagesActions.setAll(action.data.messages))
                break
            case '/messages/all':
                dispatch(messagesActions.setAll(action.data.messages))
                break
        }
    }
}