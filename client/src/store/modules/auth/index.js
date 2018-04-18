import { HashMap } from 'redux-structures'

const { actions, reducer } = HashMap('auth', {
    token: null,
    ownProfileId: null,
    lastLogoutAt: null,
    userId: null
})