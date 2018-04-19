import axios from 'axios'

const instance = axios.create({
    baseURL: `${window.location.origin}/api/v1/`
})

export default instance