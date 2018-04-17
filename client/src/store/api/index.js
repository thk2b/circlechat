import axios from 'axios'

const apiUrl = '/api/v1'

export default (endpoint, method, data, options) => {
    if(endpoint && method) {
        // const { token } = store.getState().auth
        // TODO: set token in auth success
        if(token){
            options.headers = { 'Authorization':'Bearer ' + token }
        }
        return axios({
            method,
            url: `${apiUrl}/${endpoint}`,
            data,
            ...options
        })
    }
    console.error('invalid api.fetch action parameters:', {
        endpoint, method, data, options
    })
}