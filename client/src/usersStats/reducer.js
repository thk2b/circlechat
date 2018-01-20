import * as c from './constants'

const DEFAULT = {
    onlineUsersCount: null,
    connectionsCount: null
}

export default function(state = DEFAULT, action){
    switch(action.type){
        case c.UPDATE_ONLINE_USERS_COUNT:
            return { 
                ...state,
                onlineUsersCount: action.count
            }
        case c.UPDATE_CONNECTIONS_COUNT:
            return { 
                ...state,
                connectionsCount: action.count
            }
        default: return state
    }
}