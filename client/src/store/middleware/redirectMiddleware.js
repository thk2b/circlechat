import { push } from 'react-router-redux'
import { getInChannel as getMessagesInChannel } from '../modules/messages'

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
        case '/channel/all':
            if(action.type === 'GET') {
                Object.keys(action.data).forEach(
                    (channelId) => dispatch(getMessagesInChannel(channelId))
                )
                return next(action)
            }
        default: 
            return next(action)
    }
}