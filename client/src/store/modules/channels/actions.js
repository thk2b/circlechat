import fetch from '../../middleware/apiMiddleware'
import { loadingActions } from '../loading'
import { errorsActions } from '../errors'

export const create = data => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        new: true
    })))
    fetch({ method: 'POST', resource: 'channel', data })
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            [channel.id]: false,
            new: false
        })))
    })
    .then( res => {
        const { channel } = res.body
        dispatch(channelActions.set( channel.id, channel ))
    })
    .catch( e => {
        dispatch(errorActions.update('channels', errs => ({
            ...errs,
            new: e.data
        })))
    })
}

export const getAll = () => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        all: true
    })))

    fetch({ method: 'GET', resource: 'channel/all' })
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            all: false
        })))
    })
    .then( res => {
        const { channels } = res.body
        dispatch(channelActions.setAll( channels ))
    })
    .catch( e => {
        dispatch(errorActions.update('channels', errs => ({
            ...errs,
            all: e.data
        })))
    })
}

export const update = (id, data) => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [id]: true
    })))
    fetch({ method: 'PUT', resource: 'channel', params: { id }, data })
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            [id]: false
        })))
    })
    .then(res => {
        dispatch(channelActions.update(id, channel => ({
            ...channel,
            ...res.body
        })))
    })
    .catch(() => {
        dispatch(errorActions.update('channels', errs => ({
            ...errs,
            [id]: e.data
        })))
    })
}

export const remove = id => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [id]: true
    })))
    fetch({ method: 'DELETE', resource: 'channel', params: { id }})
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            [id]: true
        })))
    })
    .then( res => {
        dispatch(channelActions.delete(id))
    })
    .catch( e => {
        dispatch(errorsActions.update('channel', errs => ({
            ...errs,
            [id]: err 
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

// export const update = (id, data) => {
//     return {
//         network: 'http',
//         type: 'PUT',
//         resource: '/channel',
//         params: { id },
//         data
//     }
// }

// export const remove = id => {
//     return {
//         network: 'http',
//         type: 'DELETE',
//         resource: '/channel',
//         params: { id }
//     }
// }