import { emit } from '../../middleware/socketIoMiddleware'
import api from '../../api'

import { loadingActions } from '../loading'
import { errorsActions } from '../errors'
import { actions as hasMoreActions } from '../hasMore'
import { actions as notificationsActions } from '../notifications'

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

/** count the number of new messages since last logout and return the new notification count for that channel */
const updateNotifications = (dispatch, lastLogoutAt, messages) => {
    const newNotificationsByChannel = Object.entries(messages).reduce(
        (obj, [messageId, message]) => (
            message.createdAt > lastLogoutAt /* message was created after last logout */
            ? {...obj, [messageId]: (obj[message.channelId] || 0) + 1 }
            : obj
        )
    , {})
    Object.entries(newNotificationsByChannel).forEach(
        ([ channelId, count ]) => dispatch(increment(channelId, count))
    )
}

export const getAll = () => (dispatch, getState) => {
    // we set all messages to loading
    dispatch(updateLoading({ all: true }))
    api.get('/message/all', { params: { n: 20 }})
    .finally( () => dispatch(
        updateLoading({ all: false })
    ))
    .then( res => {
        const { lastLogoutAt } = getState().auth
        dispatch(messagesActions.setAll(res.body.messages))
        updateNotifications(dispatch, lastLogoutAt, res.body.messages)
    })
    .catch(e => dispatch(
        // we add an error to all messages
        updateErrors({ all: e })
    ))
}

export const getInChannel = (channelId, after) => (dispatch, getState) => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [channelId]: true
    })))
    api.get('/messages/all', { params: { channelId, n: 20 }})
    .finally(() => dispatch(
        loadingActions.update('channels', loading => ({
            ...loading,
            [channelId]: false
        }))
    ))
    .then( res => {
        dispatch(messagesActions.setAll(res.body.messages))
        if(!after){
            const { lastLogoutAt } = getState().auth
            updateNotifications(dispatch, lastLogoutAt, res.body.messages)
        }
        dispatch(hasMoreActions.update('channels', channels => ({
            ...channels,
            [channelId]: res.body.hasMore
        })))
    })
    .catch( e => dispatch(
        errorsActions.update('channels', errors => ({
            ...errors,
            [channelId]: e
        }))
    ))
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.put('/message', data, { params: { id }})
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
    api.delete('/message', { params: { id }})
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