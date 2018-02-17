import validateIncomingNetworkAction from '../lib/validateIncomingNetworkAction'

function localReducer(state, action){
    switch(action.type){
        default: return state
    }
}

function loginReducer(state, action){
    switch(action.type){
        case 'POST':
            if(action.status === 201){
                return { token: action.token }
            } else {
        
            }
            return state
        default:
            return state
    }
}

function authReducer(state, action){
    switch(action.type){
        case 'GET':
            if(action.status === 200){

            } else {

            }
            return state
        case 'POST':
            if(action.status === 201){
                console.log(action.data)
            } else {
                
            }
            return state
        case 'PUT':
        case 'DELETE':
        default: return state
    }
}

function networkReducer(state, action){
    switch(action.resource){
        case '/auth/login':
            return loginReducer(state, action)
        case '/auth/':
            return authReducer(state, action)
        default: return state
    }
}

export default function(state = { token: null }, action){
    if(action.network){
        if(action.status){ /* incoming request */
            if(validateIncomingNetworkAction(action)){
                return networkReducer(state, action)
            }
            console.error('invalid incoming network action: ', action)
        } else { /* outgoing action */
            // set a flag: outgoing request
        }
        return state
    } else {
        return localReducer(state, action)
    }
}