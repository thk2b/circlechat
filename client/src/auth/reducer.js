import validateNetworkAction from '../lib/validateNetworkAction'

function localReducer(state, action){
    switch(action.type){
        default: return state
    }
}

function loginReducer(state, action){
    switch(action.type){
        case 'POST':
            if(action.status === 200){

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
            if(action.status === 200){

            } else {
                
            }
            return state
        case 'PUT':
        case 'DELETE':
        default: return state
    }
}

function networkReducer(state, action){
    switch(action.url){
        case 'auth/login':
            loginReducer(state, action)
        case 'auth/':
            authReducer(state, action)
    }
}

export default function(state, action){
    if(action.network !== undefined){
        if(validateNetworkAction(action)){
            return networkReducer(state, action)
        }
        console.error('invalid incoming network action: ', action)
        return state
    } else {
        return localReducer(state, action)
    }
}