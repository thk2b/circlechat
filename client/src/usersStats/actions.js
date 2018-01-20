import * as c from './constants'

export const updateOnlineUsersCount = count => ({
    type: c.UPDATE_ONLINE_USERS_COUNT,
    count
})
export const updateConnectionsCount = count => ({
    type: c.UPDATE_CONNECTIONS_COUNT,
    count
})