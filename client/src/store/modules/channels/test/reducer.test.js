import * as actions from  '../actions'
import reducer from '../reducer'
import { store } from '../../../'

describe('channels reducer', () => {
    test('outgoing create', () => {
        const state = store.getState()
        store.dispatch(actions.create({ name: 'test channel', profileId: 123 }))
        expect(
            store.getState()
        ).toEqual({
            ...state, channels: {
                ...state.channels,
                loading: true
            }
        })
    })
    test('outgoing update', () => {
        const state = store.getState()
        store.dispatch(actions.update(123, { name: 'test channel' }))
        expect(
            store.getState()
        ).toEqual({
            ...state, channels: {
                ...state.channels,
                loading: true
            }
        })
    })
    test('outgoing getAll', () => {
        const state = store.getState()
        store.dispatch(actions.getAll())
        expect(
            store.getState()
        ).toEqual({
            ...state, channels: {
                ...state.channels,
                loading: true
            }
        })
    })
    test('outgoing remove', () => {
        const state = store.getState()
        store.dispatch(actions.remove(123))
        expect(
            store.getState()
        ).toEqual({
            ...state, channels: {
                ...state.channels,
                loading: true
            }
        })
    })
})