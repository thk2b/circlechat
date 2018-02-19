import * as actions from  '../actions'
import reducer from '../reducer'
import { store } from '../../store'

describe('profiles reducer', () => {
    test('dispatching getAll', () => {
        const state = store.getState()
        store.dispatch(actions.getAll())
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true, error: null, success: null
            }
        })
    })
    test('dispatching get', () => {
        const state = store.getState()
        store.dispatch(actions.get())
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true, error: null, success: null
            }
        })
    })
    test('dispatching update', () => {
        const state = store.getState()
        store.dispatch(actions.update(123, {status: 'OFFLINE'}))
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true, error: null, success: null
            }
        })
    })
    test('dispatching create', () => {
        const state = store.getState()
        store.dispatch(actions.create({ userId: 'tester', description: 'testing' }))
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true, error: null, success: null
            }
        })
    })
    test('dispatching remove', () => {
        const state = store.getState()
        store.dispatch(actions.remove())
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true, error: null, success: null
            }
        })
    })
    test('', () => {

    })
})