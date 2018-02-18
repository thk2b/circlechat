import validateIncomingNetworkAction from '../lib/validateIncomingNetworkAction'

import { CLEAR_REQUEST_STATUS } from './actions'

function localReducer(state, action){
    switch(action.type){
        case CLEAR_REQUEST_STATUS:
            return {
                ...state,
                error: null,
                success: null
            }
        default: return state
    }
}

function loginReducer(state, action){
    switch(action.type){
        case 'POST':
            if(action.status === 201){
                // set userId - see #29
                return {
                    token: action.data.token,
                    userId: action.data.userId,
                    loading: false,
                    error: null,
                    success: {
                        message: 'logged in successfully'
                    }
                }
            } else {
                return {
                    ...state,
                    loading: false,
                    error: action.data,
                    success: null
                }
            }
        default:
            return state
    }
}

function authReducer(state, action){
    switch(action.type){
        case 'POST':
            if(action.status === 201){
                return {
                    ...state,
                    loading: false,
                    success: { message: 'registered successfully'},
                    error: null
                }
            } else {
                return {
                    ...state,
                    loading: false,
                    success: null,
                    error: action.data
                }
            }
        case 'PUT':
        case 'GET':
        case 'DELETE':
        default: return state
    }
}

function networkReducer(state, action){
    switch(action.resource){
        case '/auth/login':
            return loginReducer(state, action)
        case '/auth':
            return authReducer(state, action)
        default: return state
    }
}

const INITIAL_STATE = {
    token: null,
    userId: null,
    error: null,
    success: null,
    loading: false
}

export default function(state = INITIAL_STATE, action){
    if(action.network){
        if(action.status){ /* incoming http request */
            if(validateIncomingNetworkAction(action)){
                return networkReducer(state, action)
            } else {
                console.error('invalid incoming network action: ', action)
                return state
            }
        } else { /* outgoing http request */
            return {
                ...state,
                loading: true,
                error: null,
                success: null
            }
        }
    } else {
        return localReducer(state, action)
    }
}