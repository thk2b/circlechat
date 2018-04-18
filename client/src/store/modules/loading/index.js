import { HashMap } from 'redux-structures'

const { reducer, actions } = HashMap('loading', {
    /* whether a new channel is being created, all channels are loading, the content of a channel is loading or it is being edited */
    channels: { all: null, new: null },
    messages: { all: null, new: null },
    profiles: { all: null, new: null },
    auth: null
})

export { actions }
export default reducer