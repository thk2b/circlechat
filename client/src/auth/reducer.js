import validateIncomingNetworkAction from '../lib/validateIncomingNetworkAction'

import { CLEAR_REQUEST_STATUS } from './actions'

function localReducer(state, action){
    switch(action.type){
        case CLEAR_REQUEST_STATUS:
            return {
                ...state,
                request: { status: null }
            }
        default: return state
    }
}

function inboundNetworkReducer(state, action){
    if(! validateIncomingNetworkAction(action)){
        console.error('invalid incoming network action: ', action)
        return state
    }
    if(action.status >= 400) {
        if(action.resource !== '/auth' && action.resource !== '/auth/login') return state
        return {
            ...state,
            request: { status: action.status, ...action.data },
            loading: false
        }
    }

    if(action.type === 'connect' && action.network === 'ws'){
        return {
            ...state,
            ws: {
                loading: false, connected: true
            }
        }
    }

    switch(action.resource){
        case '/auth': switch(action.type){
            case 'POST': return {
                ...state,
                loading: false,
                request: {
                    status: action.status,
                    message: 'registered successfully'
                }
            }
            case 'PUT':
            case 'GET':
            case 'DELETE':
            default: return state
        }
        case '/auth/login': switch(action.type){
            case 'POST': return {
                ...state,
                token: action.data.token,
                userId: action.data.userId,
                loading: false,
                request: {
                    status: action.status,
                    message: 'logged in successfully'
                },
            }   
            default: return state
        }
        default: return state
    }
}

function outboundNetworkReducer(state, action){
    if(action.type === 'connect' && action.network === 'ws'){
        return {
            ...state,
            ws: {...state.ws, loading: true}
        }
    }
    switch(action.resource){
        case '/auth':
        case '/auth/login': return {
            ...state,
            loading: true
        }
        default: return state
    }
}

const INITIAL_STATE = {
    token: null,
    userId: null,
    request: { status: null },
    ws: { connected: false, loading: false },
    loading: false
}

export default function(state = INITIAL_STATE, action){
    if(action.network){
        if(action.status) return inboundNetworkReducer(state, action)
        return outboundNetworkReducer(state, action)
    } else {
        return localReducer(state, action)
    }
}