import * as c from './constants'

export const updateOnlineUsersCount = count => ({
    type: c.UPDATE_ONLINE_USERS_COUNT,
    count
})