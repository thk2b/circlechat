import { SET_THEME } from './actions'

const initialState = {
    active: 'dark'
}

export default function (state = initialState, action){
    switch(action.type){
        case SET_THEME:
            return { 
                active: action.name
             }
        default: return state
    }
}