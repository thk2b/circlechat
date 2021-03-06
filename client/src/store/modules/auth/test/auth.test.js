import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'
import { runAsync } from '../../../../testUtil'

import createStore from '../../../'
import actions from '../networkActions'
import { errorsActions } from '../../errors'

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
        runAsync(done, () => {
            const state = store.getState()
            expect(state.auth).toEqual(loginSuccessData)
            expect(state.loading.auth).toEqual({ login: false, register: false })
            done()
        })
    })
    test('auth.login error', done => {
        const loginErrorData = {
            message: 'test error'
        }
        mock.onPost('/auth/login').reply(401, loginErrorData)
        const initialState = store.getState().auth

        store.dispatch(actions.login({ userId: 'tester', pw: 123 }))
        runAsync(done, () => {
            const state = store.getState()
            expect(state.auth).toEqual(initialState)
            expect(state.loading.auth).toEqual({ login: false, register: false })
            expect(state.errors.auth.login).toEqual(loginErrorData)
            done()
        })
    })
    test('auth.register success', done => {
        const data = { userId: 'tester', pw: 123 }
        mock.onPost('/auth', data).reply(201)

        store.dispatch(actions.register(data))
        expect(store.getState().loading.auth.register).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.loading.auth).toEqual({ login: false, register: false })
            done()
        })
    })
    test('auth.register error', done => {
        const data = { message: 'test error' }
        mock.onPost('/auth').reply(422, data)

        store.dispatch(actions.register({ userId: 'tester', pw: 123 }))
        expect(store.getState().loading.auth.register).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.loading.auth).toEqual({ login: false, register: false })
            expect(state.errors.auth).toEqual({ login: null, register: data })
            done()
        })
    })
    test('clear register error', done => {
        const data = { message: 'test error' }
        mock.onPost('/auth').reply(422, data)
        store.dispatch(actions.register({ userId: 'tester', pw: 123 }))
        setTimeout(() => {
            const state = store.getState()
            try { expect(store.getState().errors.auth.register).not.toBe(undefined) }
            catch (e) { done.fail(e) }
            store.dispatch(errorsActions.clearRegisterError())
            setTimeout(() => {
                const state1 = store.getState()
                try { expect(state1.errors.auth).toEqual({ login: null, register: null }) }
                catch (e) { done.fail(e) }
                done()
            }, 0)
        }, 0)
    })
    test('clear login error', done => {
        const data = { message: 'test error' }
        mock.onPost('/auth/login').reply(422, data)
        store.dispatch(errorsActions.clearRegisterError())
        store.dispatch(actions.login({ userId: 'tester', pw: 123 }))
        setTimeout(() => {
            const state = store.getState()
            try { expect(store.getState().errors.auth.login).not.toBe(undefined) }
            catch (e) { done.fail(e) }
            store.dispatch(errorsActions.clearLoginError())
            setTimeout(() => {
                const state1 = store.getState()
                try { expect(state1.errors.auth).toEqual({ login: null, register: null }) }
                catch (e) { done.fail(e) }
                done()
            }, 0)
        }, 0)
    })
    test.skip('auth.logout', () => {

    })
})