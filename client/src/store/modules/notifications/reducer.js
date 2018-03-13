import { CLEAR_NOTIFICATIONS } from './actions'

function localReducer(state, action){
    if(action.type === CLEAR_NOTIFICATIONS) return {
        ...state,
        channels: {
            ...state.channels,
            [action.channelId]: 0
        }
    }
    return state
}

function inboundNetworkReducer(state, action){
    if(action.status >= 400) return state
    
    let currentCount
    if(action.resource === '/message' && action.type === 'POST'){
        currentCount = state.channels[action.data.message.channelId] || 0
        return {
            ...state,
            channels: {
                ...state.channels,
                [action.data.message.channelId]: currentCount + 1
            }
        }
    }

    if(action.resource === '/message/all' && action.type === 'GET'){
        const newState = state
        Object.entries(action.data).forEach(
            ([_, message]) => {
                if(newState.channels[message.channelId]){
                    newState.channels[message.channelId] += 1
                } else {
                    newState.channels[message.channelId] = 1
                }
            }
        )
        return newState
    }
    return state
}

function networkReducer(state, action){
    if(!['/message', '/message/all'].includes(action.resource)) return state

    if(action.status) return inboundNetworkReducer(state, action)
    return state /* we don't care about outgoing network actions */
}

const INITIAL_STATE = {
    channels: {}
}

export default function(state=INITIAL_STATE, action){
    if(action.network) return networkReducer(state, action)
    return localReducer(state, action)
}