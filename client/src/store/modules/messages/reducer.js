function localReducer(state, action){
    return state
}

function inboundNetworkReducer(state, action){
    if(action.status >= 400) return {
        ...state, loading: false,
        request: { status: action.status, ...action.data }
    }
    state = {
        ...state,
        loading: false,
        request: { status: action.status }
    }
    if(action.resource === '/message') {
        let id
        switch(action.type){
            case 'POST':
            case 'PUT':
            case 'DELETE':
            default: return state
        }
    } else if (action.resource === '/message/all'){
        return {
            ...state,
            data: {
                ...state.data,
                ...action.data
            }
        }
    }
}

function outboundNetworkReducer(state, action){
    switch(action.resource){
        case '/message/all':
        case '/message': return {
            ...state,
            loading: true
        }
        default: return state
    }
}

function networkReducer(state, action){
    if(!['/message', '/message/all'].includes(action.resource)) return state

    if(action.status) return inboundNetworkReducer(state, action)
    return outboundNetworkReducer(state, action)
}

const INITIAL_STATE = {
    data: {},
    loading: false,
    request: { status: null }
}

export default function(state=INITIAL_STATE, action){
    if(action.network) return networkReducer(state, action)
    return localReducer(state, action)
}