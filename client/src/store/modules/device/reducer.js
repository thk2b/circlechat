import { SET } from './actions'

const initialState = {
    isMobile: true,
    isTablet: false,
    isDesktop: false
}

export default function(state=initialState, action){
    switch(action.type){
        case SET: return action.device
        default: return state
    }
}