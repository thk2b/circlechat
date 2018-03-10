export const CLEAR_NOTIFICATIONS = '/notifications/clear'
export const clearNotifications = channelId => {
    return {
        type: CLEAR_NOTIFICATIONS,
        channelId
    }
}