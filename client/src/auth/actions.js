export const login = data => {
    return {
        network: 'http',
        resource: '/auth/login',
        type: 'POST',
        data
    }
}

export const connectWs = () => {
    return {
        network: 'ws',
        resource: '/',
        type: 'connect'
    }
}

export const register = data => {
    return {
        network: 'http',
        resource: '/auth',
        type: 'POST',
        data
    }
}

export const CLEAR_REQUEST_STATUS = 'auth/clearRequestStatus'
export const clearRequestStatus = () => {
    return {
        type: CLEAR_REQUEST_STATUS
    }
}