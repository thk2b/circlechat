import { actions as websocketActions } from '../../middleware/websocket'
import fetch from '../../api'

import { actions as authActions } from './'
import { actions as profileActions } from '../profile'
import { actions as messagesActions } from '../messages'
import { actions as channelsActions } from '../channels'
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
    .then( res => dispatch(
        authActions.setAll(res.body)
    ))
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