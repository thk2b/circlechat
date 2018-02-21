export const login = data => {
    return {
        network: 'http',
        resource: '/auth/login',
        type: 'POST',
        data
    }
}

export const loginWs = token => {
    return {
        network: 'ws',
        resource: '/auth',
        type: 'POST',
        data: { token }
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