import api from '../../api'

import { actions as loadingActions } from '../loading'
import { actions as errorsActions } from '../errors'
import { actions as profilesActions } from './'

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
    .then( res => dispatch(
        profilesActions.setAll(res.data.profiles)
    ))
    .catch(e => dispatch(updateErrors({ all: e.response.data })))
    .then(() => dispatch(updateLoading({ all: false })))
}
export const get = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.get('/profile', { params: { id }})
    .then( res => dispatch(
        profilesActions.set(id, res.data.profile)
    ))
    .catch(e => dispatch(updateErrors({ [id]: e.response.data })))
    .then(() => dispatch(updateLoading({ [id]: false })))
}

export const update = (id, data) => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.put('/profile', data, { params: { id }})
    .then( res => {
        dispatch(profilesActions.update(id, profile => (
            { ...profile, ...res.data }
        )))
    })
    .catch(e => dispatch(updateErrors({ [id]: e.response.data })))
    .then(() => dispatch(updateLoading({ [id]: false })))
}

export const create = data => dispatch => {
    dispatch(updateLoading({ new: true }))
    api.post('/profile', data)
    .then( res => dispatch(
        profilesActions.set(res.data.profile.id, res.data.profile)
    ))
    .catch(e => dispatch(updateErrors({ new: e.response.data })))
    .then(() => dispatch(updateLoading({ new: false })))
}

export const remove = id => dispatch => {
    dispatch(updateLoading({ [id]: true }))
    api.delete('/profile', { params: { id }})
    .then( res => dispatch(
        profilesActions.delete(id)
    ))
    .catch(e => dispatch(updateErrors({ [id]: e.response.data })))
    .then(() => dispatch(updateLoading({ [id]: false })))
}

export const getProfileOfUser = userId => (dispatch, getState) => {
    // dispatch(updateLoading({ ??: true }))
    api.get('/profile', { params: { userId }})
    // .finally(() => dispatch(updateLoading({ ??: false })))
    .then( res => dispatch(
        profilesActions.set(res.data.profile.id, res.data.profile)
    ))
    .catch(e => {
        const ownUserId = getState().auth.userId
        if(e.response.status === 404 && userId === ownUserId){
            dispatch(create({ userId }))
        } else {
            // flash an error ?
            // dispatch(updateErrors({ ??: e }))
        }
    })
}

export default {
    get, getAll, getProfileOfUser, create, update, remove
}