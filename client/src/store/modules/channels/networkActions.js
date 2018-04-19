import api from '../../api'
import { loadingActions } from '../loading'
import { errorsActions } from '../errors'

import { actions } from './base'

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
    .then( res => {
        const { channel } = res.data
        dispatch(actions.set( channel.id, channel ))
    })
    .catch( e => dispatch(updateErrors({ new: e.response.data })))
    .then(() => dispatch(updateLoading({ new: false })))
}

export const getAll = () => dispatch => {
    dispatch(updateLoading({ all: true }))

    api.get('/channel/all')
    .then( res => {
        console.log(res.data)
        dispatch(actions.setAll( res.data.channels ))
    })
    .catch( e => dispatch(updateErrors({ all: e.response.data })))
    .then(() => {
        dispatch(updateLoading({ all: false }))
    })
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))

    api.put('/channel', data, { params: { id }})
    .then(res => {
        dispatch(
        actions.update(id, channel => ({
            ...channel,
            ...res.data
        }))
    )})
    .catch(e => dispatch(updateErrors({ [id]: e.response.data })))
    .then(() => dispatch(updateLoading({ [id]: false })))
}

export const remove = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))

    api.delete('/channel', { params: { id }})
    .then( res => dispatch(
        actions.delete(id)
    ))
    .catch( e => dispatch(updateErrors({ [id]: e.response.data })))
    .then(() => dispatch(updateLoading({ [id]: false })))
}

export default {
    create, getAll, update, remove
}