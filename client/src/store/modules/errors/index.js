import { HashMap } from 'redux-structures'

const { reducer, actions: errorsActions } = HashMap('errors', {
    channels: { all: null, new: null },
    messages: { all: null, new: null },
    profiles: { all: null, new: null },
    auth: null
})

export { errorsActions }
export default reducer