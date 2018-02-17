import Promise from 'promise'
import axios from 'axios'
import validateOutgoingNetworkAction from '../lib/validateOutgoingNetworkAction'

const makeRequest = (url, verb, data) => {
    switch(verb){
        case 'GET':
            return axios.get(url)
        case 'POST':
            return axios.post(url, data)
        case 'PUT':
            return axios.post(url, data)
        case 'DELETE':
            return axios.post(url)
        default:
            return new Promise((_, reject) => reject(new Error('invalid http verb: ', verb)))
    }
}
console.log(process.env)
export default apiUrl => store => next => action => {
    if(action.network !== 'http') return next(action)

    if(action.status === undefined){ /* outgoing request, it does not have a status code */
        if(validateOutgoingNetworkAction(action)){
            process.env.NODE_ENV === 'development' && console.log('outgoing http request: ', action)
            makeRequest(apiUrl + action.resource, action.type, action.data)
            .then(res => {
                return {
                    ...action,
                    status: res.status,
                    data: res.data
                }
            })
            .then(newAction => {
                process.env.NODE_ENV === 'development' && console.log('incoming http request: ', newAction)
                store.dispatch(newAction)
            })
            .catch(e => {
                // if not a network error, dispatch and reducers handle the application error
                console.error('error in http request: ', action, e)
            })
        } else {
            process.env.NODE_ENV === 'development' && console.error('invalid outgoing network action: ', action)
        }
    }
    next(action)
}