import * as actions from  '../actions'
import reducer from '../reducer'
import { store } from '../../../'

describe('profiles reducer', () => {
    test('outgoing getAll', () => {
        const state = store.getState()
        store.dispatch(actions.getAll())
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true
            }
        })
    })
    test('outgoing get', () => {
        const state = store.getState()
        store.dispatch(actions.get())
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true
            }
        })
    })
    test('outgoing update', () => {
        const state = store.getState()
        store.dispatch(actions.update(123, {status: 'OFFLINE'}))
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true
            }
        })
    })
    test('outgoing create', () => {
        const state = store.getState()
        store.dispatch(actions.create({ userId: 'tester', description: 'testing' }))
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true
            }
        })
    })
    test('outgoing remove', () => {
        const state = store.getState()
        store.dispatch(actions.remove())
        expect(
            store.getState()
        ).toEqual({
            ...state, profiles: {
                ...state.profiles,
                loading: true
            }
        })
    })
    test('incoming getAll error', () => {
        const state = reducer(undefined, actions.create({}))
        expect(
            reducer(state, {
                network: 'http',
                type: 'GET',
                resource: '/profile/all',
                status: 999,
                data: { message: 'test error' }
            })
        ).toEqual({
            ...state,
            loading: false,
            request: { status: 999, message: 'test error'}
        })
    })
    test('incoming getAll success', () => {
        const data = {
            123: { id: 123, name: 'tester', description: '', status: 'ONLINE'}
        }
        const state = reducer(undefined, actions.create(data))
        expect(
            reducer(state, {
                network: 'http',
                type: 'GET',
                resource: '/profile/all',
                status: 200,
                data
            })
        ).toEqual({
            ...state,
            data,
            loading: false,
            request: { status: 200 }
        })
    })
    test('incoming get error', () => {
        const state = reducer(undefined, actions.get(123))
        expect(
            reducer(state, {
                network: 'http',
                type: 'GET',
                resource: '/profile',
                status: 999,
                data: { message: 'test error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 999, message: 'test error'}
        })
    })
    test('incoming get success', () => {
        const state = reducer(undefined, actions.get(123))
        const data = {
            id: 123,
            userId: 999,
            status: 'OFFLINE'
        }
        expect(
            reducer(state, {
                network: 'http',
                type: 'GET',
                resource: '/profile',
                params: { id: 123 },
                status: 200,
                data: { profile: data }
            })
        ).toEqual({
            ...state,
            data: {
                ...state.data, 123: data
            },
            loading: false,
            request: { status: 200 }
        })
    })
    test('incoming get own profile error', () => {
        const state = reducer(undefined, actions.get(123))
        expect(
            reducer(state, {
                network: 'http',
                type: 'GET',
                resource: '/profile',
                userId: 'tester',
                status: 999,
                data: { message: 'test error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 999, message: 'test error'}
        })
    })
    test('incoming get own profile success', () => {
        const state = reducer(undefined, actions.get(123))
        const data =  {
            id: 123,
            userId: 'tester',
            status: 'OFFLINE'
        }
        expect(
            reducer(state, {
                network: 'http',
                type: 'GET',
                resource: '/profile',
                ownUserId: 'tester',
                status: 200,
                data: { profile: data }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 200 },
            ownProfileId: 123,
            data: {
                ...state.data,
                [data.id]: data
            }
        })
    })
    test('incoming update error', () => {
        const data = {
            123: {
                id: 123,
                userId: 987,
                status: 'ONLINE'
            }
        }
        const state = {
            ...reducer(undefined, {}),
            data
        }
        expect(
            reducer(state, {
                network: 'http',
                type: 'PUT',
                resource: '/profile',
                params: {id: 123},
                status: 999,
                data: { message: 'test error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 999, message: 'test error'}
        })
    })
    test('incoming update success', () => {
        const data = {
            123: {
                id: 123,
                userId: 987,
                status: 'ONLINE'
            }
        }
        const updateData = {
            status: 'OFFLINE'
        }
        const state = {
            ...reducer(undefined, {}),
            data
        }

        expect(
            reducer(state, {
                network: 'http',
                type: 'PUT',
                resource: '/profile',
                params: {id: 123},
                status: 202,
                data: updateData
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 202 },
            data: {
                ...state.data,
                123: { ...data[123], ...updateData }
            }
        })
    })
    test('incoming create error', () => {
        const state = reducer(undefined, {})
        expect(
            reducer(state, {
                network: 'http',
                type: 'POST',
                resource: '/profile',
                status: 999,
                data: { message: 'test error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 999, message: 'test error'}
        })
    })
    test('incoming create success', () => {
        const data = {
            id: 123, userId: 987, status: 'ONLINE'
        }
        const state = reducer(undefined, {})
        expect(
            reducer(state, {
                network: 'http',
                type: 'POST',
                resource: '/profile',
                status: 201,
                data: { profile: data }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 201 },
            data: {
                ...state.data,
                123: { ...data }
            }
        })
    })
    test('incoming remove error', () => {
        const data = {
            123: {
                id: 123,
                userId: 987,
                status: 'ONLINE'
            }
        }
        const state = {
            ...reducer(undefined, {}),
            data
        }
        expect(
            reducer(state, {
                network: 'http',
                type: 'DELETE',
                resource: '/profile',
                params: {id: 123},
                status: 999,
                data: { message: 'test error' }
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 999, message: 'test error'}

        })
    })
    test('incoming remove success', () => {
        const data = {
            123: {
                id: 123,
                userId: 987,
                status: 'ONLINE'
            }
        }
        const state = {
            ...reducer(undefined, {}),
            data
        }
        expect(
            reducer(state, {
                network: 'http',
                type: 'DELETE',
                resource: '/profile',
                params: {id: 123},
                status: 202,
            })
        ).toEqual({
            ...state, 
            loading: false,
            request: { status: 202 },
            data: {}
        })
    })
})