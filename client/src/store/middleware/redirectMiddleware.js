import { push } from 'react-router-redux'
import { getAll as getAllMessages } from '../modules/messages'
import { getAll as getAllChannels } from '../modules/channels'
import {
    getProfileOfUser,
    create as createProfile,
    getAll as getAllProfiles
} from '../modules/profiles'
import { clearNotifications } from '../modules/notifications'

/**
 * This middleware listens for specific network actions and triggers a redirect.
 */

export default ({ getState, dispatch }) => next => action => {
    if(!action.network) return next(action)

    next(action)

    if(action.status === undefined ) return

    const { userId } = getState().auth

    if(action.status === 404
        && action.resource === '/profile' 
        && action.params.userId === userId
    ){
        return dispatch(createProfile({ userId }))
    }

    if(action.status >= 400) return

    switch(action.resource){
        case '/auth/login':
            dispatch(getProfileOfUser(userId))
            dispatch(getAllProfiles())
            dispatch(getAllChannels())
            dispatch(getAllMessages())
            return
        case '/channel':
            if(action.type === 'POST' && action.ownUserId){
                dispatch(push(`/channel/${action.data.channel.id}`))
            }
            return

        case '/message':
            if(action.type === 'POST'){
                const state = getState()
                if(action.data.message.profileId === state.profiles.ownProfileId){
                    dispatch(clearNotifications(action.data.message.channelId))
                }
                return
            }
        default: 
            return
    }
}