import { push } from 'react-router-redux'

/**
 * This middleware listens for specific network actions and triggers a redirect.
 */

export default ({ getState, dispatch }) => next => action => {
    if(!action.network) return next(action)
    if(action.status === undefined || action.status >= 400) return next(action)

    switch(action.resource){
        case '/channel':
            if(action.type === 'POST' && action.ownUserId){
                dispatch(push(`/channel/${action.data.channel.id}`))
                return next(action)
            }
        default: 
            return next(action)
    }
}