import { push } from 'react-router-redux'
import { getAll as getAllMessages } from '../modules/messages'
import { getAll as getAllChannels } from '../modules/channels'
import {
    getProfileOfUser,
    create as createProfile,
    getAll as getAllProfiles
} from '../modules/profiles'
import { clear as clearNotifications } from '../modules/notifications'

/**
 * This middleware listens for specific network actions and triggers side effects such as:
 * - triggering local redirects
 * - dispatching network actions
 * - dispatchin local actions
 */

export default ({ getState, dispatch }) => next => action => {
    if(!action.network || action.status === undefined) return next(action)

    next(action)

    const { userId } = getState().auth

    /* errors */
    if(action.status === 404
        && action.resource === '/profile' 
        && action.params.userId === userId
    ) return dispatch(createProfile({ userId }))

    if(action.status >= 400) return

    /* success */
    switch(action.resource){
        case '/auth/login':
            dispatch(getProfileOfUser(userId))
            dispatch(getAllProfiles())
            dispatch(getAllChannels())
            dispatch(getAllMessages())
            break
        case '/channel':
            if(action.type === 'POST' && action.ownUserId){
                dispatch(push(`/channel/${action.data.channel.id}`))
            }
            break

        case '/message':
            if(action.type === 'POST'){
                const state = getState()
                if(action.data.message.profileId === state.profiles.ownProfileId){
                    dispatch(clearNotifications(action.data.message.channelId))
                }
                break
            }
        default: 
            break
    }
}