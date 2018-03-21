import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import { SET_THEME } from './actions'

const initialState = {
    active: 'light',
    data: {
        light: lightBaseTheme,
        dark: darkBaseTheme
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