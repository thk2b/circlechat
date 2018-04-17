import { emit } from '../../middleware/socketIoMiddleware'
import { fetch } from '../../api'

import { loadingActions } from '../loading'
import { errorsActions } from '../errors'
import { messagesActions } from './'

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
        messagesActions.setAll(res.body.messages)
    ))
    .catch(e => dispatch(
        errorsActions.update('messages', errs => ({
            ...errs,
            all: e
        }))
    ))
}

export const getInChannel = (channelId, after) =>  dispatch => {
    dispatch(loadingActions.update('channel', loading => ({
        ...loading,
        [channelId]: true
    })))
    fetch('/messages/all', 'GET', { channelId, n: 20 })
    .finally(() => dispatch(
        loadingActions.update('channel', loading => ({
            ...loading,
            [channelId]: false
        }))
    ))
    .then( res => dispatch(
        messagesActions.setAll(res.body.messages)
    ))
    .catch( e => dispatch(
        errorsActions.update('channel', errs => ({
            ...errs,
            [channelId]: e
        }))
    ))
}

export const update = (id, data) => dispatch => {
    dispatch(loadingActions.update('messages', loading => ({
        ...loading,
        [id]: true
    })))
    fetch('/message', 'PUT', { id })
    .finally(() => dispatch(
        loadingActions.update('messages', loading => ({
            ...loading,
            [id]: false
        }))
    ))
    .then( res => dispatch(
        messagesActions.update(id, message => ({ ...message, ...res.body }))
    ))
    .catch( e => dispatch(
        errorsActions.update('messages', errs => ({
            ...errs,
            [id]: e
        }))
    ))
}

export const remove = id => dispatch => {
    dispatch(loadingActions.update('messages', loading => ({
        ...loading,
        [id]: true
    })))
    fetch('/message', 'DELETE', { id })
    .finally(() => dispatch(
        loadingActions.update('messages', loading => ({
            ...loading,
            [id]: false
        }))
    ))
    .then( res => dispatch(
        messagesActions.delete(id)
    ))
    .catch( e => dispatch(
        errorsActions.update('messages', errs => ({
            ...errs,
            [id]: e
        }))
    ))
}