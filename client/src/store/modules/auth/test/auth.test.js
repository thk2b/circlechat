import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'

import createStore from '../../../'
import actions from '../networkActions'
import { actions as a } from '../index'
describe('auth network actions', () => {
    let store
    const mock = new MockAdapter(api)

    beforeEach(() => {
        mock.reset()
        store = createStore()
    })
    test('auth.login success', done => {
        const loginSuccessData = {
            token: 'test',
            userId: 'tester',
            lastLogoutAt: 123
        }
        mock.onPost('/auth/login').reply(201, loginSuccessData)

        store.dispatch(actions.login({ userId: 'tester', pw: 123 }))
        expect(store.getState().loading.auth.login).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.auth).toEqual(loginSuccessData)
            expect(state.loading.auth).toEqual({ login: false, register: false })
            done()
        }, 0)
    })
    test('auth.login error', () => {
        const loginErrorData = {
            message: 'test error'
        }
        mock.onPost('/auth/login').reply(401, loginErrorData)
        const initialState = store.getState().auth

        store.dispatch(actions.login({ userId: 'tester', pw: 123 }))
        setTimeout(() => {
            const state = store.getState()
            expect(state.auth).toEqual(initialState)
            expect(state.loading.auth).toEqual({ login: false, register: false })
            expect(state.errors.auth).toEqual({ login: loginErrorData, register: false })
            done()
        }, 0)
    })
    test.skip('auth.logout', () => {

    })
})