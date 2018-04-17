import { emit } from '../../middleware/socketIoMiddleware'
import { fetch } from '../../api'

import { loadingActions } from '../loading'
import { messagesActions } from './'

import { actions } from './'
import { errorsActions } from '../errors';

export const send = dispatch => data => { /* { profileId, channelId, text } */
    dispatch(loadingActions.update('messages', loading => ({
        ...loading,
        new: true
    })))
    dispatch(emit('/message', 'POST', data))
}

export const getAll = () => dispatch => {
    dispatch(loadingActions.update('messages', loading => ({
        ...loading,
        new: true
    })))
    fetch('/message/all', 'GET', { params: { n: 20 }})
    .finally( () => dispatch(
        loadingActions.update('messages', loading => ({
            ...loading,
            all: true
        }))
    ))
    .then( res => dispatch(
        actions.setAll(res.body.messages)
    ))
    .catch(e => dispatch(
        errorsActions.update('messages', errs => ({
            ...errs,
            all: e
        }))
    ))
}

export const getInChannel = (channelId, after) => {
    const params = { channelId, n: 20 }
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