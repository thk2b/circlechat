import * as actions from  '../actions'
import reducer from '../reducer'
import { store } from '../../../'

describe('messages reducer', () => {
    test('outgoing send', () => {
        const state = store.getState()
        store.dispatch(actions.send({
            text: 'test message', profileId: 123, channelId: 321
        }))
        expect(
            store.getState()
        ).toEqual({
            ...state, messages: {
                ...state.messages,
                loading: true
            }
        })
    })
    test('outgoing get messages in channel', () => {
        const state = store.getState()
        store.dispatch(actions.getInChannel(123, 1))
        expect(
            store.getState()
        ).toEqual({
            ...state, messages: {
                ...state.messages,
                loading: true
            }
        })
    })
    test('outgoing update', () => {
        const state = store.getState()
        store.dispatch(actions.update(123, { text: 'updated' }))
        expect(
            store.getState()
        ).toEqual({
            ...state, messages: {
                ...state.messages,
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
            ...state, messages: {
                ...state.messages,
                loading: true
            }
        })
    })
})