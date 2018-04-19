import { HashMap } from 'redux-structures'

const { reducer, actions } = HashMap('loading', {
    /* whether a new channel is being created, all channels are loading, the content of a channel is loading or it is being edited */
    channels: { all: false, new: false },
    messages: { all: false, new: false },
    profiles: { all: false, new: false },
    auth: { login: false, register: false }
})

export { actions as loadingActions }
export default reducer