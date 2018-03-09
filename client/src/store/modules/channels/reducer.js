function localReducer(state, action){
    return state
}

function inboundNetworkReducer(state, action){
    return state
}

function outboundNetworkReducer(state, action){
    switch(action.resource){
        case '/channel': return {
            ...state,
            loading: true
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
    request: { status: null },
    data: {}
}

export default function(state = INITIAL_STATE, action){
    if(action.network) return networkReducer(state, action)
    return localReducer(state, action)
}