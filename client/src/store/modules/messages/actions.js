export const send = data => { /* { profileId, channelId, text } */
    return {
        network: 'ws',
        type: 'POST',
        resource: '/message',
        data
    }
}

export const getAll = () => {
    return {
        network: 'http',
        type: 'GET',
        resource: '/message/all',
        params: { n: 30 }
    }
}

export const getInChannel = (channelId, after) => {
    const params = { channelId, n: 50 }
    if(after !== undefined) params.after = after
    return {
        network: 'http',
        type: 'GET',
        resource: '/message/all',
        params
    }
}

export const update = (id, data) => {
    return {
        network: 'http',
        type: 'PUT',
        resource: '/message',
        params: { id },
        data
    }
}

export const remove = id => {
    return {
        network: 'http',
        type: 'DELETE',
        resource: '/message',
        params: { id }
    }
}