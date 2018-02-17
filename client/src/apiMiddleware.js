import Promise from 'promise'
import axios from 'axios'
import validateOutgoingNetworkAction from './lib/validateOutgoingNetworkAction'

const makeRequest = (url, verb, data) => {
    switch(verb){
        case 'GET':
            return axios.get(action.url)
        case 'POST':
            return axios.post(action.url, action.payload)
        case 'PUT':
            return axios.post(action.url, action.payload)
        case 'DELETE':
            return axios.post(action.url)
        default:
            return new Promise((_, reject) => reject(new Error('invalid http verb: ', verb)))
    }
}

export default apiUrl => store => next => action => {
    if(action.network === 'http'){
        if(validateOutgoingNetworkAction(action)){
            console.log('outgoing http request: ', action)
            makeRequest(apiUrl + action.url)
            .then(res => {
                return {
                    ...action,
                    status: res.status,
                    payload: res.body
                }
            })
            .then(action => {
                console.log('incoming http request: ', action)
                store.dispatch(action)
            })
            .catch(e => {
                // if not a network error, dispatch and reducers handle the application error
                console.error('error in http request: ', action, e)
            })

        } else {
            console.error('invalid outgoing network action: ', action)
        }
    }
    next(action)
}