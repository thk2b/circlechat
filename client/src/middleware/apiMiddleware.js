import Promise from 'promise'
import axios from 'axios'
import validateOutgoingNetworkAction from '../lib/validateOutgoingNetworkAction'

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
                    ownUserId, /* required to check if we originated the action, or if anotehr client did */
                    status: res.status,
                    data: res.data
                }
            })
            .then(newAction => {
                process.env.NODE_ENV === 'development' && console.log('incoming http request: ', newAction)
                store.dispatch(newAction)
            })
            .catch( ({ response }) => {
                if(process.env.NODE_ENV === 'test'){
                    /* we always get a network err in unit tests */
                    return
                }
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