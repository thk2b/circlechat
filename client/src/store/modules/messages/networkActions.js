import { emit } from '../../middleware/websocket'
import api from '../../api'

import { actions as loadingActions } from '../loading'
import { actions as errorsActions } from '../errors'
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
    .then( res => {
        const { lastLogoutAt } = getState().auth
        dispatch(messagesActions.setAll(res.data.messages))
        updateNotifications(dispatch, lastLogoutAt, res.data.messages)
    })
    .catch(e => dispatch(
        // we add an error to all messages
        updateErrors({ all: e })
    ))
    .then( () => dispatch(
        updateLoading({ all: false })
    ))
}

export const getInChannel = (channelId, after) => (dispatch, getState) => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [channelId]: true
    })))
    api.get('/messages/all', { params: { channelId, n: 20 }})
    .then( res => {
        dispatch(messagesActions.setAll(res.data.messages))
        if(!after){
            const { lastLogoutAt } = getState().auth
            updateNotifications(dispatch, lastLogoutAt, res.data.messages)
        }
        dispatch(hasMoreActions.update('channels', channels => ({
            ...channels,
            [channelId]: res.data.hasMore
        })))
    })
    .catch( e => dispatch(
        errorsActions.update('channels', errors => ({
            ...errors,
            [channelId]: e
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
        updateErrors({ [id]: e })
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
        updateErrors({ [id]: e })
    ))
    .then(() => dispatch(
        updateLoading({ [id]: false })
    ))
}

export default {
    getAll, getInChannel, send, update, remove
}