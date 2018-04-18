import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'

import createStore from '../../../'
import * as actions from '../networkActions'

const mock = new MockAdapter(api)

describe('auth network actions', () => {
    let store
    beforeEach(() => {
        mock.reset()
        store = createStore()
    })
    test('auth.login success', () => {
        const loginSuccessData = {
            token: 'test',
            userId: 'tester',
            lastLogoutAt: 123
        }
        mock.onPost('auth/login').reply(200, loginSuccessData)
        store.dispatch(actions.login())
        console.log(store.getState())
    })
    test('auth.login error', () => {

    })
})