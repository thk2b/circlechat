export const create = data => {
    /* data = { profileId, name } */
    return {
        network: 'http',
        type: 'POST',
        resource: '/channel',
        data
    }
}

export const getAll = () => {
    console.log('object')
    return {
        network: 'http',
        type: 'GET',
        resource: '/channel/all'
    }
}

export const update = (id, data) => {
    return {
        network: 'http',
        type: 'PUT',
        resource: '/channel',
        params: { id },
        data
    }
}

export const remove = id => {
    return {
        network: 'http',
        type: 'DELETE',
        resource: '/channel',
        params: { id }
    }
}