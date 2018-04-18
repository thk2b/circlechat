import api from '../../api'

import { loadingActions } from '../loading'
import { errorsActions } from '../errors'
import { profilesActions } from './'

/* wrapper to update profiles' loading status */
const updateLoading = obj => loadingActions.update('profiles', loading => ({
    ...loading,
    ...obj
}))

const updateErrors = obj => errorsActions.update('profiles', errors => ({
    ...errors,
    ...obj
}))

export const getAll = () => dispatch => {
    dispatch(updateLoading({ all: true }))
    api.get('/profile/all')
    .finally(() => dispatch(updateLoading({ all: false })))
    .then( res => dispatch(
        profilesActions.setAll(res.body.messages)
    ))
    .catch(e => dispatch(updateErrors({ all: e })))
}
export const get = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.get('/profile', { params: { id }})
    .finally(() => dispatch(updateLoading({ id: false })))
    .then( res => dispatch(
        profilesActions.set(id, res.body.message)
    ))
    .catch(e => dispatch(updateErrors({ [id]: e })))
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.put('/profile', data, { params: { id }})
    .finally(() => dispatch(updateLoading({ id: false })))
    .then( res => dispatch(
        profilesActions.update(id, profile => ({ ...profile, ...res.body.message }))
    ))
    .catch(e => dispatch(updateErrors({ [id]: e })))
}

export const create = data => dispatch => {
    dispatch(updateLoading({ new: true }))
    api.post('/profile', data, { params: { id }})
    .finally(() => dispatch(updateLoading({ new: false })))
    .then( res => dispatch(
        profilesActions.set(res.body.profile.id, res.body.profile)
    ))
    .catch(e => dispatch(updateErrors({ new: e })))
}

export const remove = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.delete('/profile', { params: { id }})
    .finally(() => dispatch(updateLoading({ [id]: false })))
    .then( res => dispatch(
        profilesActions.delete(id)
    ))
    .catch(e => dispatch(updateErrors({ [id]: e })))
}

export const getProfileOfUser = userId => (dispatch, getState) => {
    // dispatch(updateLoading({ ??: true }))
    api.get('/profile', { params: { userId }})
    // .finally(() => dispatch(updateLoading({ ??: false })))
    .then( res => dispatch(
        profilesActions.set(res.body.message.id, res.body.message)
    ))
    .catch(e => {
        const ownUserId = getState().auth.userId
        if(userId === ownUserId){
            dispatch(create(userId))
        } else {
            // flash an error ?
            // dispatch(updateErrors({ ??: e }))
        }
    })
}