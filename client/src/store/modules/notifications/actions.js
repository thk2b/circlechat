export const CLEAR = '/notifications/clear'
export const clear = channelId => {
    return {
        type: CLEAR,
        channelId
    }
}

export const INCREMENT = '/notifications/increment'
export const increment = channelId => {
    return {
        type: INCREMENT,
        channelId
    }
}