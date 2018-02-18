import * as actions from '../actions'
import reducer from '../reducer'

describe('auth reducer', () => {
    test('dispatching login action', () => {
        // todo: change after data validatin is implemented
        const state = reducer(undefined, {})
        expect(
            reducer(state, actions.login({}))
        ).toEqual(
            {...state, loading: true}
        )
    })
    test('dispatching register action', () => {
        const state = reducer(undefined, {})
        expect(
            reducer(state, actions.register({}))
        ).toEqual(
            {...state, loading: true}
        )
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
            error: { message: 'some error'}
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
            success: { message: 'registered successfully' }
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
            error: { message: 'some error'}
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
            success: { message: 'logged in successfully' },
            token: 'some token',
            userId: 'user id'
        })
    })
    test('clear request status action', () => {
        const state = reducer(undefined, {
            network: 'http', type: 'POST', resource: '/auth/login', 
            status: 400, data: { message: 'some error' }
        })
        expect(
            reducer(state, actions.clearRequestStatus())
        ).toEqual(
            {...state, error: null, success: null}
        )
    })
})