import validateIncomingNetworkAction from '../lib/validateIncomingNetworkAction'

function localReducer(state, action){
    return state
}

function inboundNetworkReducer(state, action){
    if(! validateIncomingNetworkAction(action)){
        console.error('invalid incoming network action: ', action)
        return state
    }
    if(action.status >= 400) return {
        ...state,
        error: action.data,
        loading: false
    }
    switch(action.resource){
        case '/profile': 
            switch(action.type){
                case 'POST':
                case 'GET': return {
                    ...state,
                    data: { ...state.data, [action.data.id]: action.data }
                }
                case 'PUT': return {
                    ...state,
                    data: { 
                        ...state.data,
                        [action.data.id]: {
                            ...state.data[action.data.id],
                            ...action.data
                        }
                    }
                }
                case 'DELETE': return {
                    ...state,
                    data: Object.entries(state.data).reduce(
                        (obj, [id, profile]) => id === action.resourceId? obj : {...obj, [id]: profile}
                    , {})
                }
                default: return state
            }
        case '/profile/all':
            if(action.type === 'GET') return {
                ...state,
                data: action.data
            }
            return state
        default: return state
    }
}

function outboundNetworkReducer(state, action){
    switch(action.resource){
        case '/profile':
        case '/profile/all': return {
            ...state,
            loading: true,
            error: null,
            success: null
        }
        default: return state
    }
}

function networkReducer(state, action){
    if(action.status) return inboundNetworkReducer({...state, loading: false}, action)
    return outboundNetworkReducer(state, action)
}

const INITIAL_STATE = {
    loading: false,
    error: null,
    success: null,
    data: {}
}

export default function(state=INITIAL_STATE, action){
    if(action.network){
        return networkReducer(state, action)
    }
    return localReducer(state, action)
}