import { CLEAR, INCREMENT, RESET } from './actions'

const initialState = {
    channels: {},
    total: 0
}

export default function(state=initialState, action){
    switch(action.type){
        case CLEAR: return {
            ...state,
            channels: {
                ...state.channels,
                [action.channelId]: 0
            },
            total: state.total - (state.channels[action.channelId] || 0)
        }
        case INCREMENT: return {
            ...state,
            channels: {
                ...state.channels,
                [action.channelId]: ( state.channels[action.channelId] || 0 ) + action.by
            },
            total: state.total + action.by
        }
        case RESET: return initialState
        default: return state
    }
}