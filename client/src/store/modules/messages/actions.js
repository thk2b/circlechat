export const send = data => { /* { profileId, channelId, text } */
    return {
        network: 'ws',
        type: 'POST',
        resource: '/message',
        data
    }
}

export const getInChannel = (channelId, afterId) => {
    const params = { channelId }
    if(afterId !== undefined) params.afterId = afterId
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