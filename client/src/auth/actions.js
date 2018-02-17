export const login = payload => {
    return {
        network: 'http',
        resource: '/auth/login',
        type: 'POST',
        payload
    }
}

export const register = payload => {
    return {
        network: 'http',
        resource: '/auth',
        type: 'POST',
        payload
    }
}