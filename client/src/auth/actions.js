export const login = payload => {
    return {
        network: 'http',
        url: '/auth/login',
        type: 'POST',
        payload
    }
}

export const register = payload => {
    return {
        network: 'http',
        url: '/auth',
        type: 'POST',
        payload
    }
}