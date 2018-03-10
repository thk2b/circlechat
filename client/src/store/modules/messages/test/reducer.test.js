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
    test('incomming send error', () => {
        const state = reducer(undefined, actions.send({
            text: 'test message', profileId: 123, channelId: 321
        }))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'ws', resource: '/message', type: 'POST',
                status: 999, data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incomming send success', () => {
        const state = reducer(undefined, {})
        const message = {
            text: 'test message', profileId: 123, channelId: 321, id: 123
        }
        expect(
            reducer(state, {
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message }
            })
        ).toEqual({
            ...state, loading: false, request: { status: 201 },
            data: { 123: message }
        })
    })
    test('incomming getInChannel error', () => {
        const state = reducer(undefined, actions.getInChannel({ channelId: 123 }))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/message/all', type: 'GET',
                status: 999, data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incomming getInChannel success', () => {
        const state = reducer(
            reducer(undefined, {
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message: { text: 'test message 0', profileId: 123, channelId: 321, id: 1 }}
            })
        , {})
        const messages = {
            123: { text: 'test message 1', profileId: 123, channelId: 321, id: 123 },
            234: { text: 'test message 2', profileId: 123, channelId: 321, id: 234 },
            345: { text: 'test message 3', profileId: 123, channelId: 321, id: 345 },
        }
        expect(
            reducer(state, {
                network: 'http', resource: '/message/all', type: 'GET',
                params: { channelId: 321, n: 3 }, status: 200, data: messages
            })
        ).toEqual({
            ...state, loading: false, request: { status: 200 },
            data: {...state.data, ...messages }
        })
    })
    test('incomming update error', () => {
        const state = reducer(undefined, actions.update(123, { text: 'test message' }))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/message', type: 'PUT',
                status: 999, data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incomming update success', () => {
        const state = reducer(
            reducer(undefined, {
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message: {
                    text: 'test message 0', profileId: 321, channelId: 321, id: 123
                }}
            })
        , {})
        const updateData = { id: 123, text: 'new text' }
        expect(
            reducer(state, {
                network: 'http', resource: '/message', type: 'PUT',
                status: 202, data: updateData
            })
        ).toEqual({
            ...state, loading: false, request: { status: 202 },
            data: {...state.data, 123: {...state.data[123], ...updateData }}
        })
    })
    test('incomming remove error', () => {
        const state = reducer(undefined, actions.remove(123))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/message', type: 'DELETE',
                status: 999, data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incomming remove success', () => {
        const messages = {
            123: { text: 'test message 1', profileId: 123, channelId: 321, id: 123 },
        }
        const state = {
            ...reducer(undefined, {}),
            data: messages
        }
        expect(
            reducer(state, {
                network: 'http', resource: '/message', type: 'DELETE',
                params: { id: 123 }, status: 202
            })
        ).toEqual({
            ...state, loading: false, request: { status: 202 },
            data: {}
        })
    })
})