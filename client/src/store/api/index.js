import axios from 'axios'

const apiUrl = '/api/v1'

const fetchApi = (endpoint, method, params, data) => {
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
            params
        })
    }
    console.error('invalid api.fetch action parameters:', {
        endpoint, method, data, options
    })
}

export const get = (endpoint, params) => fetchApi(endpoint, 'GET', params)

export default fetchApi