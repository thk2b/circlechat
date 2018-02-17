export const login = data => {
    return {
        network: 'http',
        resource: '/auth/login',
        type: 'POST',
        data
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