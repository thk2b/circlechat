import { HashMap } from 'redux-structures'
import networkActions from './actions'

const { reducer, actions } = HashMap('messages')

const channelActions = {
    data: actions, network: networkActions
}

export default reducer
export { channelActions }