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