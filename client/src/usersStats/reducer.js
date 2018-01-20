import * as c from './constants'

const DEFAULT = {
    onlineUsersCount: null
}

export default function(state = DEFAULT, action){
    switch(action.type){
        case c.UPDATE_ONLINE_USERS_COUNT:
            return { 
                ...state,
                onlineUsersCount: action.count
            }
        default: return state
    }
}