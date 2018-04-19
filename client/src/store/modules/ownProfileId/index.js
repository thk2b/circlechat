import { Value } from 'redux-structures'

const { reducer, actions } = Value('own-profile-id')

export default reducer
export { actions as ownProfileIdActions }