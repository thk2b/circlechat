import fetch from '../../middleware/apiMiddleware'

export const create = data => dispatch => {
    fetch({ method: 'POST', resource: 'channel', data })
    .then( res => {
        const { channel } = res.body
        dispatch(loadingActions.update('channels', loading => ({
            [channel.id]: false,
            new: false
        })))
        dispatch(channelActions.set( channel.id, channel ))
    })
    .catch( e => {
        dispatch(loadingActions.update('channels', loading => ({
            new: false
        })))
        dispatch(errorActions.update('channels', errs => ({
            new: e.data
        })))
    })
}

export const getAll = () => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        all: true
    })))

    fetch({ method: 'GET', resource: 'channel/all' })
    .then( res => {
        const { channels } = res.body
        dispatch(loadingActions.setAll('channels', loading => ({
            all: false
        })))
        dispatch(channelActions.setAll( channels ))
    })
    .catch( e => {
        dispatch(loadingActions.update('channels', loading => ({
            all: false
        })))
        dispatch(errorActions.update('channels', errs => ({
            all: e.data
        })))
    })
}

// export const create = data => {
//     /* data = { profileId, name } */
//     return {
//         network: 'http',
//         type: 'POST',
//         resource: '/channel',
//         data
//     }
// }

// export const getAll = () => {
//     return {
//         network: 'http',
//         type: 'GET',
//         resource: '/channel/all'
//     }
// }

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