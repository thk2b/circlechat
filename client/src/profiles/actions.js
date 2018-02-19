export const getAll = () => {
    return {
        network: 'http',
        resource: '/profiles/all',
        type: 'GET'
    }
}
export const get = id => {
    return {
        network: 'http',
        resource: '/profile',
        resourceId: id,
        type: 'GET'
    }
}
export const update = (id, data) => {
    return {
        network: 'http',
        resource: '/profile',
        resourceId: id,
        type: 'PUT',
        data
    }
}
export const create = (id, data) => {
    return {
        network: 'http',
        resource: '/profile',
        resourceId: id,
        type: 'POST',
        data
    }
}
export const remove = id => {
    return {
        network: 'http',
        resource: '/profile',
        resourceId: id,
        type: 'DELETE'
    }
}