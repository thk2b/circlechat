import { CLEAR, INCREMENT } from './actions'

const initialState = {
    channels: {}
}

export default function(state=initialState, action){
    switch(action.type){
        case CLEAR: return {
            ...state,
            channels: {
                ...state.channels,
                [action.channelId]: 0
            }
        }
        case INCREMENT: return {
            ...state,
            channels: {
                ...state.channels,
                [action.channelId]: ( state.channels[action.channelId] || 0 ) + 1
            }
        }
        default: return state
    }
}