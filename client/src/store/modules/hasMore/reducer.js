/** 
 * this reducer represents whether there is more data on the server based on the data it sends over. 
*/

const intialState = {
    messages: {
        /* [channelId]: Boolean, ...*/
    }
}

export default function(state=intialState, action){
    if(!action.network || !action.status || action.status >= 400) return state

    switch(action.resource){
        case '/message/all':
            if(!action.params.n){
                console.error('cannot know whether there are more messages without the `n` query param')
                return state
            }
            const { channelId, n } = action.params
            if(channelId !== undefined){
                return {
                    ...state,
                    messages: {
                        ...state.messages,
                        [channelId]: Object.keys(action.data).length === n 
                    }
                }
            } else {
                 /* count messages per channel. if a channel has a count = to n, then there are more messages available in that channel */
                const newMessagesState = {}
                Object.entries(action.data).reduce(
                    (counts, [_, message]) => {
                        const currentCount = (counts[message.channelId] || 0) + 1
                        counts[message.channelId] = currentCount    
                        newMessagesState[message.channelId] = currentCount === n
                    
                        return {...counts, [message.channelId]: currentCount }
                    }
                , {})
                return {
                    ...state,
                    messages: {
                        ...state.messages,
                        ...newMessagesState
                    }
                }
            }
        default:
            return state
    }
}