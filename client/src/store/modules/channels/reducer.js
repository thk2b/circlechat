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
    if(action.resource === '/channel') {
        let id
        switch(action.type){
            case 'POST': return {
                ...state,
                data: { ...state.data, 
                    [action.data.channel.id]: action.data.channel
                }
            }
            case 'PUT':
                id = action.data.id || action.params.id
                return {
                    ...state,
                    data: {
                        ...state.data,
                        [id]: {
                            ...state.data[id], ...action.data
                        }
                    }
                }
            case 'DELETE':
                id = action.params&&action.params.id || action.data.id
                return {
                    ...state,
                    data: Object.entries(state.data).reduce(
                        (obj, [_, profile]) => profile.id === id
                            ? obj: {...obj, [id]: profile }
                    , {})
                }
            default: return state
        }
    } else if (action.resource === '/channel/all'){
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
        case '/channel/all':
        case '/channel': return {
            ...state,
            loading: true
        }
        default: return state
    }
}

function networkReducer(state, action){
    if(!['/channel', '/channel/all'].includes(action.resource)) return state

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