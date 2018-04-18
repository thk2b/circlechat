import { actions as websocketActions } from '../../middleware/websocket'
import fetch from '../../api'

import { actions as authActions } from './'
import profileActions from '../profiles/networkActions'
import messagesActions from '../messages/networkActions'
import channelsActions from '../channels/networkActions'
import { actions as loadingActions } from '../loading'
import { actions as errorsActions } from '../errors'

export const logout = () => dispatch => {
    dispatch(websocketActions.disconnect())
    dispatch(authActions.reset())
    dispatch(profilesActions.reset())
    dispatch(messagesActions.reset())
    dispatch(channelsActions.reset())
}

export const login = data => dispatch => {
    dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            login: true
        }))
    )
    fetch('/auth/login', 'POST', undefined, data)
    .finally(() => dispatch(
        loadingActions.update('auth', auth => ({
            ...auth,
            login: false
        }))
    ))
    .then( res => {
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
    fetch('/auth', 'POST', undefined, data)
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