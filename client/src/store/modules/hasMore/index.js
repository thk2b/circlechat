import { HashMap } from 'redux-structures'

const { reducer, actions } = HashMap('hasMore', {
    channels: {}
})

export default reducer
export { actions as hasMoreActions }