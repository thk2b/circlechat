import { emit } from '../../middleware/websocket/actions'
import api from '../../api'

import { loadingActions } from '../loading'
import { errorsActions } from '../errors'
import { hasMoreActions } from '../hasMore'
import { notificationsActions } from '../notifications'

import { actions as messagesActions } from './base'

const updateLoading = obj => loadingActions.update('messages', loading => ({
    ...loading,
    ...obj
}))

const updateErrors = obj => errorsActions.update('messages', errors => ({
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
            ? {...obj, [message.channelId]: (obj[message.channelId] || 0) + 1 }
            : obj
        )
    , {})
    Object.entries(newNotificationsByChannel).forEach(
        ([ channelId, count ]) => dispatch(notificationsActions.increment(channelId, count))
    )
}

export const getAll = () => (dispatch, getState) => {
    // we set all messages to loading
    dispatch(updateLoading({ all: true }))
    api.get('/message/all', { params: { n: 20 }})
    .then( res => {
        const { lastLogoutAt } = getState().auth
        dispatch(messagesActions.setAll(res.data.messages))
        updateNotifications(dispatch, lastLogoutAt, res.data.messages)
    })
    .catch(e => dispatch(
        updateErrors({ all: e.response.data })
    ))
    .then(() => dispatch(
        updateLoading({ all: false })
    ))
}

export const getInChannel = (channelId, after) => (dispatch, getState) => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [channelId]: true
    })))
    api.get('/message/all', { params: { channelId, after, n: 20 }})
    .then( res => {
        dispatch(messagesActions.setAll(res.data.messages))
        const { lastLogoutAt } = getState().auth
        updateNotifications(dispatch, lastLogoutAt, res.data.messages)
        dispatch(hasMoreActions.update('channels', channels => ({
            ...channels,
            [channelId]: res.data.hasMore
        })))
    })
    .catch( e => dispatch(
        errorsActions.update('channels', errors => ({
            ...errors,
            [channelId]: e.response.data
        }))
    ))
    .then(() => dispatch(
        loadingActions.update('channels', loading => ({
            ...loading,
            [channelId]: false
        }))
    ))
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.put('/message', data, { params: { id }})
    .then( res => dispatch(
        messagesActions.update(id, message => ({ ...message, ...res.data }))
    ))
    .catch( e => dispatch(
        updateErrors({ [id]: e.response.data })
    ))
    .then(() => dispatch(
        updateLoading({ [id]: false })
    ))
}

export const remove = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.delete('/message', { params: { id }})
    .then( res => dispatch(
        messagesActions.delete(id)
    ))
    .catch( e => dispatch(
        updateErrors({ [id]: e.response.data })
    ))
    .then(() => dispatch(
        updateLoading({ [id]: false })
    ))
}

export default {
    getAll, getInChannel, send, update, remove
}