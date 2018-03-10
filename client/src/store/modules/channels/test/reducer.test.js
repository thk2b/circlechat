import * as actions from  '../actions'
import reducer from '../reducer'
import { store } from '../../../'

describe('channels reducer', () => {
    test('outgoing create', () => {
        const state = store.getState()
        store.dispatch(actions.create({ name: 'test channel create', profileId: 123 }))
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
    test('incoming create error', () => {
        const state = reducer(undefined, actions.create({ profileId: 123, name: 'test channel' }))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/channel', type: 'POST', status: 999,
                data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incoming create success', () => {
        const state = reducer(undefined, actions.create({ profileId: 123, name: 'test channel' }))
        const data = { channel: { id: 123, profileId: 123, name: 'test channel 1' }}
        expect(
            reducer(state, {
                network: 'http', resource: '/channel', type: 'POST', status: 201, data
            })
        ).toEqual({
            ...state, loading: false, request: { status: 201 },
            data: {...state.data, [data.channel.id]: data.channel }
        })
    })
    test('incoming update error', () => {
        const state = reducer(undefined, actions.create({ profileId: 123, name: 'test channel' }))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/channel', type: 'PUT', status: 999,
                data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incoming update success', () => {
        const data = { 123: { profileId: 123, name: 'test channel 1' }}
        const updateData = { name: 'new name', id: 123 }
        const state = {
            ...reducer(undefined, actions.create({ profileId: 123, name: 'test channel' })),
            data
        }
        
        expect(
            reducer(state, {
                network: 'http', resource: '/channel', type: 'PUT', status: 201,
                params: { id: 123 } , data: updateData
            })
        ).toEqual({
            ...state, loading: false, request: { status: 201 },
            data: {
                ...state.data,
                [updateData.id]: {...state.data[updateData.id], ...updateData }
            }
        })
    })
    test('incoming getAll error', () => {
        const state = reducer(undefined, actions.create({ profileId: 123, name: 'test channel' }))
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/channel/all', type: 'GET', status: 999,
                data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incoming getAll success', () => {
        const initialData = {
            123: { id: 123, profileId: 321, name: 'channel 1'},
            234: { id: 234, profileId: 321, name: 'channel 2'}
        }
        const state = {
            ...reducer(undefined, actions.create({ profileId: 123, name: 'test channel' })),
            data: initialData
        }
        const data = {
            345: { id: 345, profileId: 321, name: 'channel 1' },
            456: { id: 456, profileId: 321, name: 'channel 1' }
        }
        expect(
            reducer(state, {
                network: 'http', resource: '/channel/all', type: 'GET', status: 200,
                data
            })
        ).toEqual({
            ...state, loading: false, request: { status: 200 },
            data: {
                ...state.data,
                ...data
            }
        })
    })
    test('incoming remove error', () => {
        const data = {
            123: { id: 123, profileId: 321, name: 'test channel' }
        }
        const state = {
            ...reducer(undefined,  {}),
            data
        }
        const errorData = { message: 'test error', status: 999 }
        expect(
            reducer(state, {
                network: 'http', resource: '/channel', type: 'DELETE', status: 999,
                data: errorData
            })
        ).toEqual({
            ...state, loading: false, request: errorData
        })
    })
    test('incoming remove success', () => {
        const data = {
            123: { id: 123, profileId: 321, name: 'test channel' }
        }
        const state = {
            ...reducer(undefined,  {}),
            data
        }
        expect(
            reducer(state, {
                network: 'http', resource: '/channel', type: 'DELETE', status: 202,
                params: { id: 123 }
            })
        ).toEqual({
            ...state, loading: false, request: { status: 202 },
            data: {}
        })
    })
})