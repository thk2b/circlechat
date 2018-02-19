import Promise from 'promise'
import axios from 'axios'
import validateOutgoingNetworkAction from '../lib/validateOutgoingNetworkAction'

const makeRequest = (url, verb, data) => {
    if(process.env.NODE_ENV === 'test'){
        return new Promise(() => {})
    }
    switch(verb){
        case 'GET':
            return axios.get(url)
        case 'POST':
            return axios.post(url, data)
        case 'PUT':
            return axios.put(url, data)
        case 'DELETE':
            return axios.delete(url)
        default:
            return new Promise((_, reject) => reject(new Error('invalid http verb: ', verb)))
    }
}

export default apiUrl => store => next => action => {
    if(action.network !== 'http') return next(action)

    if(action.status === undefined){ /* outgoing request, it does not have a status code */
        if(validateOutgoingNetworkAction(action)){
            process.env.NODE_ENV === 'development' && console.log('outgoing http request: ', action)

            const { resourceId: id } = action
            const url = `${apiUrl}${action.resource}${id?'/'+id:''}`

            makeRequest(url, action.type, action.data)
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
            .catch( ({ response }) => {
                const newAction = {
                    ...action,
                    status: response.data.status,
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