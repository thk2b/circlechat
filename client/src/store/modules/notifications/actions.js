export const CLEAR = '/notifications/clear'
export const clear = channelId => {
    return {
        type: CLEAR,
        channelId
    }
}

export const INCREMENT = '/notifications/increment'
export const increment = (channelId, by=1) => {
    return {
        type: INCREMENT,
        channelId, by
    }
}