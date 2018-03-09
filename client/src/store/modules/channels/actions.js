export const create = data => {
    /* data = { profileId, name } */
    return {
        network: 'api',
        type: 'POST',
        resource: '/channel',
        data
    }
}

export const getAll = () => {
    return {
        network: 'api',
        type: 'GET',
        resource: '/channel/all'
    }
}

export const update = (id, data) => {
    return {
        network: 'api',
        type: 'PUT',
        resource: '/channel',
        params: { id },
        data
    }
}

export const remove = id => {
    return {
        network: 'api',
        type: 'DELETE',
        resource: '/channel',
        params: { id }
    }
}