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
                        [channelId]: action.data.hasMore
                    }
                }
            } else {
                /* Since we are recieving messages from all channels,
                just assume there are more messages in all channels instead of checking if every channel has more.
                */
                return {
                    ...state,
                    messages: Object.keys(state.messages).reduce(
                        (nextState, channelId) => ({...nextState, [channelId]: true })
                    , {})
                }
            }
        default:
            return state
    }
}