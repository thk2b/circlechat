import { push } from 'react-router-redux'
import { getAll as getAllMessages } from '../modules/messages'
import { clearNotifications } from '../modules/notifications'

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
            }
            return next(action)
        case '/channel/all':
            dispatch(getAllMessages())
            return next(action)
        case '/message':
            if(action.type === 'POST'){
                next(action)
                const state = getState()
                if(action.data.message.profileId === state.profiles.ownProfileId){
                    dispatch(clearNotifications(action.data.message.channelId))
                }
                return
            }
        default: 
            return next(action)
    }
}