import { SET_THEME } from './actions'

const initialState = {
    active: 'light',
    list: ['light', 'dark']
}

// const DEFAULT = {
//     active: 0,
//     list: [
//         { name: 'light' },
//         { name: 'dark'  }
//     ]
// }

export default function (state = initialState, action){
    switch(action.type){
        case SET_THEME:
            // if(!state.list.includes(action.name)){
            //     console.error('invalid theme: ', action.name)
            //     return state
            // }
            console.log(action)
            return { 
                ...state,
                active: action.name
             }
        default: return state
    }
}