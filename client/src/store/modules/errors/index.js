import { HashMap } from 'redux-structures'

const { reducer, actions } = HashMap('errors', {
    channels: { all: null, new: null },
    messages: { all: null, new: null },
    profiles: { all: null, new: null },
    auth: { login: null, register: null }
})

const clearRegisterError = () => actions.update('auth',
    auth => ({
        ...auth,
        register: null
    })
)

const clearLoginError = () => actions.update('auth',
    auth => ({
        ...auth,
        login: null
    })
)

const allActions = {
    ...actions,
    clearLoginError, clearRegisterError
}

export { allActions as errorsActions }
export default reducer