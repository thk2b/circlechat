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

export const RESET = '/notifications/reset'
export const reset = () => {
    return {
        type: RESET,
    }
}

/** count the number of new items since last logout and return the new notification count for that channel */
export const updateChannelNotifications = dispatch => (lastLogoutAt, items) => {
    const newNotificationsByChannel = Object.entries(items).reduce(
        (obj, [itemId, item]) => (
            item.createdAt > lastLogoutAt /* message was created after last logout */
            ? {...obj, [item.channelId]: (obj[item.channelId] || 0) + 1 }
            : obj
        )
    , {})
    Object.entries(newNotificationsByChannel).forEach(
        ([ channelId, count ]) => dispatch(increment(channelId, count))
    )
}

export default { increment, clear, reset, updateChannelNotifications }