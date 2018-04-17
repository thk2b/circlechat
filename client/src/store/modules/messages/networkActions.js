import { emit } from '../../middleware/socketIoMiddleware'
import { fetch } from '../../api'

import { loadingActions } from '../loading'
import { errorsActions } from '../errors'
import { messagesActions } from './'

const updateLoading = obj => loadingActions.update('channels', loading => ({
    ...loading,
    ...obj
}))

const updateErrors = obj => errorsActions.update('channels', errors => ({
    ...errors,
    ...obj
}))

export const send = data => dispatch => { /* { profileId, channelId, text } */
    dispatch(updateLoading({ new: true }))
    dispatch(emit('/message', 'POST', data))
}

export const getAll = () => dispatch => {
    // we set all messages to loading
    dispatch(updateLoading({ all: true }))
    get('/message/all', { n: 20 })
    .finally( () => dispatch(
        updateLoading({ all: false })
    ))
    .then( res => dispatch(
        messagesActions.setAll(res.body.messages)
    ))
    .catch(e => dispatch(
        // we add an error to all messages
        updateErrors({ all: e })
    ))
}

export const getInChannel = (channelId, after) =>  dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [channelId]: true
    })))
    fetch('/messages/all', 'GET', { channelId, n: 20 })
    .finally(() => dispatch(
        loadingActions.update('channels', loading => ({
            ...loading,
            [channelId]: false
        }))
    ))
    .then( res => dispatch(
        messagesActions.setAll(res.body.messages)
    ))
    .catch( e => dispatch(
        errorsActions.update('channels', errors => ({
            ...errors,
            [channelId]: e
        }))
    ))
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    fetch('/message', 'PUT', { id })
    .finally(() => dispatch(
        updateLoading({ [id]: false })
    ))
    .then( res => dispatch(
        messagesActions.update(id, message => ({ ...message, ...res.body }))
    ))
    .catch( e => dispatch(
        updateErrors({ [id]: e })
    ))
}

export const remove = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    fetch('/message', 'DELETE', { id })
    .finally(() => dispatch(
        updateLoading({ [id]: false })
    ))
    .then( res => dispatch(
        messagesActions.delete(id)
    ))
    .catch( e => dispatch(
        updateErrors({ [id]: e })
    ))
}