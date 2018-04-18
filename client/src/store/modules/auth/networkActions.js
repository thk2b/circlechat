import { actions as websocketActions } from '../../middleware/websocket'
import api from '../../api'
import axios from 'axios'

import { actions as authActions } from './'
import profileActions from '../profiles/networkActions'
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
    .finally(() => dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            login: false
        }))
    ))
    .then( res => {
        axios.defaults.headers.common['Authorization'] = red.body.token
        dispatch(authActions.setAll(res.body))
        dispatch(profilesActions.getProfileOfUser(res.body.userId))
        dispatch(profilesActions.getAll())
        dispatch(messagesActions.getAll())
        dispatch(channelsActions.getAll())
    })
    .catch( e => dispatch(errorsActions.update('auth', auth => ({
        ...auth,
        login: e
    }))))
}

export const register = data => dispatch => {
    dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            register: true
        }))
    )
    api.post('/auth', data)
    .finally(() => dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            register: false
        }))
    ))
    .then( res => dispatch(authActions.setAll(res.body)))
    .catch( e => dispatch(
        errorsActions.update('auth', auth => ({
            ...auth,
            register: e
        }))
    ))
}