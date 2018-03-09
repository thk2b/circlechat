function localReducer(state, action){
    return state
}

function inboundNetworkReducer(state, action){
    if(action.status >= 400) return {
        ...state,
        request: { status: action.status, ...action.data },
        loading: false
    }
    state = {
        ...state,
        loading: false,
        request: { status: action.status }
    }
    if(action.resource === '/profile'){
        let profile, id
        switch(action.type){
            case 'POST':
            case 'GET':
                profile = action.data.profile
                if(profile.userId === action.ownUserId){ /* we got our own profile */
                    return {
                        ...state,
                        ownProfileId: profile.id,
                        data: { ...state.data, [profile.id]: profile }
                    }
                }
                return {
                    ...state,
                    data: { ...state.data, [profile.id]: profile }
                }
            case 'PUT': 
                id = (action.params && action.params.id) || action.data.id
                return {
                    ...state,
                    data: { 
                        ...state.data,
                        [id]: {
                            ...state.data[id],
                            ...action.data
                        }
                    }
                }
            case 'DELETE': 
                id = action.params&&action.params.id || action.data.id
                return {
                    ...state,
                    data: Object.entries(state.data).reduce(
                        (obj, [_, profile]) => profile.id === id
                            ? obj : {...obj, [id]: profile }
                    , {})
                }
            default: return state
        }
    } else if (action.resource === '/profile/all'){
        if(action.type === 'GET') return {
            ...state,
            data: action.data
        }
        return state
    }
}

function outboundNetworkReducer(state, action){
    switch(action.resource){
        case '/profile':
        case '/profile/all': return {
            ...state,
            loading: true
        }
        default: return state
    }
}

function networkReducer(state, action){
    if(!['/profile', '/profile/all'].includes(action.resource)) return state

    if(action.status) return inboundNetworkReducer(state, action)
    return outboundNetworkReducer(state, action)
}

const INITIAL_STATE = {
    loading: false,
    request: { status: null },
    ownProfileId: null,
    data: {}
}

export default function(state=INITIAL_STATE, action){
    if(action.network) return networkReducer(state, action)
    return localReducer(state, action)
}