import fetch from '../../api'
import { loadingActions } from '../loading'
import { errorsActions } from '../errors'

import { actions } from './'

export const create = data => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        new: true
    })))

    fetch('channel','POST', data)
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            [channel.id]: false,
            new: false
        })))
    })
    .then( res => {
        const { channel } = res.body
        dispatch(actions.set( channel.id, channel ))
    })
    .catch( e => {
        dispatch(errorActions.update('channels', errs => ({
            ...errs,
            new: e.data
        })))
    })
}

export const getAll = () => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        all: true
    })))

    fetch('channel/all', 'GET')
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            all: false
        })))
    })
    .then( res => {
        const { channels } = res.body
        dispatch(actions.setAll( channels ))
    })
    .catch( e => {
        dispatch(errorActions.update('channels', errs => ({
            ...errs,
            all: e.data
        })))
    })
}

export const update = (id, data) => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [id]: true
    })))

    fetch('channel', 'PUT', data, { params: { id }})
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            [id]: false
        })))
    })
    .then(res => {
        dispatch(actions.update(id, channel => ({
            ...channel,
            ...res.body
        })))
    })
    .catch(() => {
        dispatch(errorActions.update('channels', errs => ({
            ...errs,
            [id]: e.data
        })))
    })
}

export const remove = id => dispatch => {
    dispatch(loadingActions.update('channels', loading => ({
        ...loading,
        [id]: true
    })))

    fetch('channel', 'DELETE', undefined, { params: { id }})
    .finally(() => {
        dispatch(loadingActions.update('channels', loading => ({
            ...loading,
            [id]: true
        })))
    })
    .then( res => {
        dispatch(actions.delete(id))
    })
    .catch( e => {
        dispatch(errorsActions.update('channel', errs => ({
            ...errs,
            [id]: err 
        })))
    })
}