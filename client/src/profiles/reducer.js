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
        error: { ...action.data, status: action.status },
        loading: false
    }
    // state = {...state, success: true}
    switch(action.resource){
        case '/profile': 
            switch(action.type){
                case 'POST':
                case 'GET': return {
                    ...state, success: true, loading: false,
                    data: { ...state.data, [action.data.id]: action.data }
                }
                case 'PUT': return {
                    ...state, success: true, loading: false,
                    data: { 
                        ...state.data,
                        [action.resourceId]: {
                            ...state.data[action.resourceId],
                            ...action.data
                        }
                    }
                }
                case 'DELETE': 
                return {
                    ...state, success: true, loading: false,
                    data: Object.entries(state.data).reduce(
                        (obj, [id, profile]) => profile.id === action.resourceId? obj : {...obj, [id]: profile}
                    , {})
                }
                default: return state
            }
        case '/profile/all':
            if(action.type === 'GET') return {
                ...state, success: true, loading: false,
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
    if(action.status) return inboundNetworkReducer(state, action)
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