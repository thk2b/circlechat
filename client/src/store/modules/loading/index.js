import { HashMap } from 'redux-structures'

const { reducer, actions: loadingActions } = HashMap('loading')

export { loadingActions }
export default reducer