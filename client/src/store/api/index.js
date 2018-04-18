import axios from 'axios'

const instance = axios.create({
    baseUrl: `${window.location.href}api/v1`
})

export default instance