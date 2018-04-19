import axios from 'axios'

const instance = axios.create({
    baseURL: `${window.location.href}api/v1/`
})

export default instance