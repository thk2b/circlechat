import { increment, clear } from '../modules/notifications'

export default ({ getState, dispatch }) => next => action => {
    if(!action.network || !action.status || action.status >= 400){
        return next(action)
    }
    
    next(action)

    const state = getState()

    if(action.resource === '/message' && action.type === 'POST'){
        const { profileId, channelId } = action.data.message
        if(profileId === state.profiles.ownProfileId) return /* don't increment when recieving own message */
        else return dispatch(increment(channelId))
    }

    if(action.resource === '/message/all' && action.type === 'GET'){
        return Object.entries(action.data).forEach(
            ([_, message]) => dispatch(increment(message.channelId))
        )
    }
}