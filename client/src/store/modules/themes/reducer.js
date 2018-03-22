import { SET_THEME } from './actions'

const initialState = {
    active: 'light',
    data: {
        light: {},
        dark: {}
    }
}

export default function (state = initialState, action){
    switch(action.type){
        case SET_THEME:
            return { 
                ...state,
                active: action.name
             }
        default: return state
    }
}