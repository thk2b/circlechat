import * as actions from '../actions'
import reducer from '../reducer'
import { store } from '../../../'

describe('auth reducer', () => {
    test('dispatching login action', () => {
        // todo: change after data validatin is implemented
        const state = store.getState()
        store.dispatch(actions.login())
        expect(
            store.getState()
        ).toEqual({
            ...state, auth: {
                ...state.auth,
                loading: true
            }
        })
    })
    test('dispatching register action', () => {
        const state = store.getState()
        store.dispatch(actions.register())
        expect(
            store.getState()
        ).toEqual({
            ...state, auth: {
                ...state.auth,
                loading: true
            }
        })
    })
    test('incoming register error', () => {
        const state = reducer(undefined, {})
        expect(
            reducer(state, {
                network: 'http', type: 'POST', resource: '/auth', 
                status: 400, data: { message: 'some error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { message: 'some error', status: 400 }
        })
    })
    test('incoming register success ', () => {
        const state = reducer(undefined, {})
        expect(
            reducer(state, {
                network: 'http', type: 'POST', resource: '/auth', 
                status: 201, data: {}
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 201, message: 'registered successfully'}
        })
    })
    test('incoming login error', () => {
        const state = reducer(undefined, {})
        expect(
            reducer(state, {
                network: 'http', type: 'POST', resource: '/auth/login', 
                status: 400, data: { message: 'some error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { message: 'some error', status: 400 }
        })
    })
    test('incoming login success', () => {
        const state = reducer(undefined, {})
        expect(
            reducer(state, {
                network: 'http', type: 'POST', resource: '/auth/login', 
                status: 201, data: { token: 'some token', userId: 'user id'}
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 201, message: 'logged in successfully'},
            token: 'some token',
            userId: 'user id'
        })
    })
    test('clear request status action', () => {
        const state = reducer(undefined, {
            network: 'http', type: 'POST', resource: '/auth/login', 
            status: 400, data: { message: 'some error', status: 400}
        })
        expect(
            reducer(state, actions.clearRequestStatus())
        ).toEqual(
            {...state, request: { status: null }}
        )
    })
    test('logout action', () => {
        const state = reducer(undefined, {
            network: 'http', type: 'POST', resource: '/auth/login', 
            status: 201, data: { token: 'some token', userId: 'user id'}
        })
        expect(
            reducer(state, actions.logout())
        ).toEqual({
            ...state,
            token: null,
            userId: null
        })
    })
})