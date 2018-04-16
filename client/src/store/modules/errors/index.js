import { HashMap } from 'redux-structures'

const { reducer, actions: errorsActions } = HashMap('errors')

export { errorsActions }
export default reducer