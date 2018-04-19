import { HashMap } from 'redux-structures'

const { reducer, actions } = HashMap('errors', {
    channels: { all: null, new: null },
    messages: { all: null, new: null },
    profiles: { all: null, new: null },
    auth: { login: null, register: null }
})

export { actions as errorsActions }
export default reducer