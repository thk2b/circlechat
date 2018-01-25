import * as c from './constants'

export default ( state = {}, action ) => {
    switch(action.type){
        case c.ADD_MESSAGE:
            const { id, text, createdAt } = action.message
            return ({
                ...state,
                [id]: {
                    id, text, createdAt
                }
            })
        case c.ADD_MESSAGES:
            const { messages } = action
            return messages.reduce(
                (obj, message) => ({
                    ...obj,
                    [message.id]: message
                })
            , { })
                
        default:
            return state
    }
}