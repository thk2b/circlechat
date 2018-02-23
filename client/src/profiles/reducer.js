import validateIncomingNetworkAction from '../lib/validateIncomingNetworkAction'

function localReducer(state, action){
    return state
}

function inboundNetworkReducer(state, action){
    if(! validateIncomingNetworkAction(action)){
        console.error('invalid incoming network action: ', action)
        return state
    }
    if(action.status >= 400){
        if(action.resource === '/profile' || action.resource === '/profile/all'){
            return {
                ...state,
                request: { status: action.status, ...action.data },
                loading: false
            }
        }
        return state
    }
    switch(action.resource){
        case '/profile':
            let profile
            switch(action.type){
                case 'POST':
                case 'GET':
                    profile = action.data.profile
                    if(profile.userId === action.ownUserId){ /* we got our own profile */
                        return {
                            ...state, loading: false, request: { status: action.status },
                            ownProfileId: profile.id,
                            data: { ...state.data, [profile.id]: profile }
                        }
                    }
                    return {
                        ...state, loading: false, request: { status: action.status },
                        data: { ...state.data, [profile.id]: profile }
                    }
                case 'PUT': 
                    profile = action.data.profile
                    const id = action.params.id
                    return {
                        ...state, loading: false, request: { status: action.status },
                        data: { 
                            ...state.data,
                            [action.params.id]: {
                                ...state.data[action.params.id],
                                ...profile
                            }
                        }
                    }
                case 'DELETE': 
                return {
                    ...state, loading: false, request: { status: action.status },
                    data: Object.entries(state.data).reduce(
                        (obj, [id, profile]) => profile.id === action.params.id? obj : {...obj, [id]: profile}
                    , {})
                }
                default: return state
            }
        case '/profile/all':
            if(action.type === 'GET') return {
                ...state, loading: false, request: { status: action.status },
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
    ownProfileId: null,
    data: {}
}

export default function(state=INITIAL_STATE, action){
    if(action.network){
        return networkReducer(state, action)
    }
    return localReducer(state, action)
}