import axios from 'axios'
import validateOutgoingNetworkAction from '../lib/validateOutgoingNetworkAction'
import validateIncomingNetworkAction from '../lib/validateIncomingNetworkAction'

const FETCH = 'api-middleware/fetch'
export const fetch = options => ({
    type: FETCH,
    options
})

export default apiUrl => store => next => action => {
    if(action.type !== FETCH) return next(action)
    const { resource, method, params, data } = action.options
    
    process.env.NODE_ENV === 'development' && console.log('outgoing http request: ', action)
    const config = {}
    if(action.data) config.data = action.data

    const { token, userId: ownUserId } = store.getState().auth
    if(token) config.headers = {
        'Authorization':'Bearer ' + token
    }
    if(action.params) config.params = action.params
    
    return axios({
        method,
        url: `${apiUrl}/${resource}`,
        ...config
    })
}

export default apiUrl => store => next => action => {
    if(action.network !== 'http') return next(action)

    if(action.status === undefined){ /* outgoing request, it does not have a status code */
        if(validateOutgoingNetworkAction(action)){
            process.env.NODE_ENV === 'development' && console.log('outgoing http request: ', action)

            const config = {}

            const { resourceId: id } = action
            const url = `${apiUrl}${action.resource}${id?'/'+id:''}`

            if(action.data) config.data = action.data

            const { token, userId: ownUserId } = store.getState().auth
            if(token) config.headers = {
                'Authorization':'Bearer ' + token
            }

            if(action.params) config.params = action.params
            
            axios({
                method: action.type.toLowerCase(),
                url,
                ...config
            })
            .then(res => {
                return {
                    ...action,
                    ownUserId, /* required to check if we originated the action, or if another client did */
                    status: res.status,
                    data: res.data
                }
            })
            .then(newAction => {
                if(process.env.NODE_ENV === 'development' || 
                   process.env.NODE_ENV === 'test'    
                ){
                    console.log('incoming http request: ', newAction)
                    !validateIncomingNetworkAction(newAction) && console.error('invalid incoming network action: ', action)
                }
                store.dispatch(newAction)
            })
            .catch( (e) => {
                if(process.env.NODE_ENV === 'test'){
                    /* we always get a network err in unit tests */
                    return
                }
                console.error(e)
                const { response } = e
                const newAction = {
                    ...action,
                    status: response.status,
                    data: response.data
                }
                store.dispatch(newAction)
            })

        } else {
            process.env.NODE_ENV === 'development' && console.error('invalid outgoing network action: ', action)
        }
    }
    next(action)
}