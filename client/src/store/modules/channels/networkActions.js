import api from '../../api'
import { loadingActions } from '../loading'
import { errorsActions } from '../errors'

import { actions } from './'

const updateLoading = obj => loadingActions.update('channels', loading => ({
    ...loading,
    ...obj
}))

const updateErrors = obj => errorsActions.update('channels', errors => ({
    ...errors,
    ...obj
}))

export const create = data => dispatch => {
    dispatch(updateLoading({ new: true }))

    api.post('/channel', data)
    .finally(() => dispatch(updateLoading({ new: false })))
    .then( res => {
        const { channel } = res.body
        dispatch(actions.set( channel.id, channel ))
    })
    .catch( e => dispatch(updateErrors({ new: e })))
}

export const getAll = () => dispatch => {
    dispatch(updateLoading({ all: true }))

    api.get('channel/all')
    .finally(() => {
        dispatch(updateLoading({ all: false }))
    })
    .then( res => dispatch(
        actions.setAll( res.body.channels )
    ))
    .catch( e => dispatch(updateErrors({ all: e })))
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))

    api.put('channel', data, { params: { id }})
    .finally(dispatch(updateLoading({ [id]: false })))
    .then(res => dispatch(
        actions.update(id, channel => ({
            ...channel,
            ...res.body
        }))
    ))
    .catch(e => dispatch(updateErrors({ [id]: e })))
}

export const remove = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))

    api.delete('channel', { params: { id }})
    .finally(() => dispatch(updateLoading({ [id]: false })))
    .then( res => dispatch(
        actions.delete(id)
    ))
    .catch( e => dispatch(updateErrors({ [id]: e })))
}