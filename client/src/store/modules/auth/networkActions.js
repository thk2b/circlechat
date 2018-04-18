import { actions as websocketActions } from '../../middleware/websocket'
import api from '../../api'
import axios from 'axios'

import { actions as authActions } from './'
import profilesActions from '../profiles/networkActions'
import messagesActions from '../messages/networkActions'
import channelsActions from '../channels/networkActions'
import { actions as loadingActions } from '../loading'
import { actions as errorsActions } from '../errors'
import { actions as hasMoreActions } from '../hasMore'
import { actions as notificationsActions } from '../notifications'

export const logout = () => dispatch => {
    axios.defaults.headers.common['Authorization'] = undefined
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
        console.log({res})
        axios.defaults.headers.common['Authorization'] = res.data.token
        dispatch(authActions.setAll(res.data))
        dispatch(profilesActions.getProfileOfUser(res.data.userId))
        dispatch(profilesActions.getAll())
        dispatch(messagesActions.getAll())
        dispatch(channelsActions.getAll())
    })
    .catch( e => {
        console.log(e)
        dispatch(errorsActions.update('auth', auth => ({
            ...auth,
            login: e
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
            register: e
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