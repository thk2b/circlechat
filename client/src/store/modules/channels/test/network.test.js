import { channelActions as actions } from '../'
import createStore from '../../../'

describe('`channels` network actions', () => {
    test('outbound create', () => {
        const store = createStore()
        const state = store.getState()
        store.dispatch(actions.network.create({
            name: 'test channel create', profileId: 123
        }))
        expect(
            store.getState()
        ).toEqual({
            ...state,
            channels: {
                ...state.channels,
            },
            loading: {
                ...state.loading,
                channels: {
                    ...state.loading.channels,
                    new: true
                }
            }
        })
    })
    test('inbound create success', () => {
        const store = createStore()
        const state = store.getState()
        const data = { channel: { id: 123, profileId: 123, name: 'test channel 1' }}
        store.dispatch({
            network: 'http', resource: '/channel', type: 'POST', status: 201, data
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            channels: {
                ...state.channels,
                123: data.channel
            },
            loading: {
                ...state.loading,
                channels: {
                    ...state.loading.channels,
                    123: false,
                    new: false
                }
            },
            hasMore: {
                channels: {
                    ...state.hasMore.channels,
                    123: false
                }
            }
        })
    })
    test('inbound create error', () => {
        const store = createStore()
        const state = store.getState()
        const errorData = { message: 'test error', status: 999 }
        store.dispatch({
            network: 'http', resource: '/channel', type: 'POST',
            status: 999, data: errorData
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                ...state.loading,
                channels: {
                    ...state.loading.channels,
                    123: false,
                    new: false
                }
            },
            errors: {
                channels: {
                    ...state.errors.channels,
                    new: true
                }
            }
        })
    })
    test('outbound update', () => {
        const store = createStore()
        const state = store.getState()
        store.dispatch(actions.network.update(123, { name: 'test channel' }))
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                ...state.loading,
                channels: {
                    ...state.loading.channels,
                    123: true
                }
            }
        })
    })
    test('inbound update success', () => {
        const store = createStore()
        const state = store.getState()
        store.dispatch(actions.data.set(123, { id: 123, profileId: 123, name: 'test channel 1' }))
        
        const updateData = { name: 'new name', id: 123 }
        const state = store.getState()
        store.dispatch({
            network: 'http', resource: '/channel', type: 'PUT', status: 201,
            params: { id: 123 } , data: updateData
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                ...state.loading,
                channels: {
                    ...state.loading.channels,
                    123: true
                }
            }
        })
    })
    test('inbound update error', () => {
        const store = createStore()
        const state = store.getState()
        store.dispatch(actions.data.set(123, { id: 123, profileId: 123, name: 'test channel 1' }))
        
        const errorData = { message: 'test error', status: 999 }
        const state = store.getState()
        store.dispatch({
            network: 'http', resource: '/channel', type: 'PUT', status: 999,
            data: errorData
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                ...state.loading,
                channels: {
                    123: false
                }
            },
            errors: {
                ...state.errors,
                channels: {
                    123: errorData
                }
            }
        })
    })
    test('outbound getAll', () => {
        const store = createStore()
        const state = store.getState()
        store.dispatch(actions.getAll())
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                ...state.loading,
                channels: {
                    all: true
                }
            }
        })
    })
    test('inbound getAll success', () => {
        const store = createStore()
        const state = store.getState()
        const data = {
            123: { id: 123, profileId: 321, name: 'channel 1'},
            234: { id: 234, profileId: 321, name: 'channel 2'}
        }
        store.dispatch({
            network: 'http', resource: '/channel/all', type: 'GET', status: 200,
            data
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            channels: data,
            loading: {
                channels: {
                    all: false,
                    123: false,
                    234: false
                }
            }
        })
    })
    test('inbound getAll error', () => {
        const store = createStore()
        const state = store.getState()
        const data = { message: 'test error', status: 999 }
        store.dispatch({
            network: 'http', resource: '/channel/all', type: 'GET',
            status: 999, data
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                channels: {
                    all: false,
                }
            },
            errors: {
                channels: {
                    all: data
                }
            }
        })
    })
    test('outbound remove', () => {
        const state = store.getState()
        store.dispatch(actions.network.remove(123))
        expect(
            store.getState()
        ).toEqual({
            ...state,
            loading: {
                channels: {
                    123: true
                }
            },
        })
    })
    test('inbound remove success', () => {
        const state = store.getState()
        store.dispatch(actions.data.set(123, { id: 123, profileId: 321, name: 'test channel' }))
        store.dispatch({
            network: 'http', resource: '/channel', type: 'DELETE', status: 202,
            params: { id: 123 }
        })
        expect(
            store.getState()
        ).toEqual({
            ...state,
            channels: {},
            loading: {
                channels: {}
            },
        })
    })
    test('inbound remove error', () => {
        const state = store.getState()
        const channel = { id: 123, profileId: 321, name: 'test channel' }
        store.dispatch(actions.data.set(123, channel))
        const data = { message: 'test error', status: 999 }

        store.dispatch({
            network: 'http', resource: '/channel', type: 'DELETE', status: 999,
            data
        })        
        expect(
            store.getState()
        ).toEqual({
            ...state,
            channels: { 123: channel },
            loading: {
                channels: {
                    ...state.loading.channels,
                    123: false
                }
            },
            errors: {
                ...state.errors,
                channels: {
                    123: data
                }
            }
        })
    })
})