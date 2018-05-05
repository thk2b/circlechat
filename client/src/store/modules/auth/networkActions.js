import { websocketActions } from '../../middleware/websocket'
import api from '../../api'

import { authActions } from './'
import { profilesActions } from '../profiles/'
import { messagesActions } from '../messages/'
import { channelsActions } from '../channels/'
import { loadingActions } from '../loading'
import { errorsActions } from '../errors'
import { hasMoreActions } from '../hasMore'
import { notificationsActions } from '../notifications'

export const logout = () => dispatch => {
    api.defaults.headers.common['Authorization'] = undefined
    dispatch(websocketActions.disconnect())
    dispatch(authActions.reset())
    dispatch(profilesActions.reset())
    dispatch(messagesActions.reset())
    dispatch(channelsActions.reset())
    dispatch(loadingActions.reset())
    dispatch(errorsActions.reset())
    dispatch(hasMoreActions.reset())
    dispatch(notificationsActions.reset())
}

export const login = data => dispatch => {
    dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            login: true
        }))
    )
    api.post('/auth/login', data)
    .then( res => {
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        dispatch(authActions.setAll(res.data))
        dispatch(websocketActions.connect(res.data.token))
        dispatch(profilesActions.getProfileOfUser(res.data.userId))
        dispatch(profilesActions.getAll())
        dispatch(messagesActions.getAll())
        dispatch(channelsActions.getAll())
    })
    .catch( e => {
        dispatch(errorsActions.update('auth', auth => ({
            ...auth,
            login: e.response.data
        })))
    })
    .then(() => dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            login: false
        }))
    ))
}

export const register = data => dispatch => {
    dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            register: true
        }))
    )
    api.post('/auth', data)
    .then( res => dispatch(authActions.setAll(res.data)))
    .catch( e => dispatch(
        errorsActions.update('auth', auth => ({
            ...auth,
            register: e.response.data
        }))
    ))
    .then(() => dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            register: false
        }))
    ))
}

export default { login, logout, register }