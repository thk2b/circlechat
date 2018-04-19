import reducer, { actions } from './base'
import networkActions from './networkActions'

const allActions = {
    ...actions, ...networkActions
}

export default reducer
export { allActions as profilesActions }