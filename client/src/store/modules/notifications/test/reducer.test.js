import * as messageActions from '../../messages'

import * as actions from  '../actions'
import reducer from '../reducer'

import createStore from '../../../'

describe('notifications reducer', () => {
    describe('incoming POST /message', () => {
        const store = createStore()
        const initialState = store.getState()
        const message1 = {
            text: 'test message', profileId: 123, channelId: 321, id: 123
        }
        const message2 = {
            text: 'test message', profileId: 123, channelId: 321, id: 123
        }
        test('should be one when the message is the first message', () => {
            store.dispatch({
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message: message1 }
            })
            expect(
                store.getState().notifications
            ).toEqual({
                ...initialState.notifications,
                channels: {
                    321: 1
                }
            })
        })
        test('should increment when there are already notifications', () => {
            store.dispatch({
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message: message2 }
            })
            expect(
                store.getState().notifications
            ).toEqual({
                ...initialState.notifications,
                channels: {
                    321: 2
                }
            })
        })
        test('should not increment for the user\'s own messages' , () => {
            store.dispatch({
                network: 'http', type: 'GET',
                resource: '/profile', ownUserId: 'tester',
                status: 200, data: { profile: {
                    id: 123,
                    userId: 'tester',
                    status: 'OFFLINE'
                }}
            }) /* set own profile */
            store.dispatch({
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message: message2 }
            })
            expect(
                store.getState().notifications
            ).toEqual({
                ...initialState.notifications,
                channels: {
                    321: 2
                }
            })
        })
        
    })
    describe('incoming GET /message/all', () => {
        const store = createStore()
        const state = store.getState()
        const messages1 = {
            123: { text: 'test message 1', profileId: 123, channelId: 321, id: 123 },
            234: { text: 'test message 2', profileId: 123, channelId: 321, id: 234 },
            345: { text: 'test message 3', profileId: 123, channelId: 321, id: 345 },
        }
        const messages2 = {
            321: { text: 'test message 4', profileId: 123, channelId: 123, id: 321 },
            432: { text: 'test message 5', profileId: 123, channelId: 123, id: 432 },
            543: { text: 'test message 6', profileId: 123, channelId: 123, id: 543 },
        }
        test('should set notifications when there are no messages', () => {
            store.dispatch({
                network: 'http', resource: '/message/all', type: 'GET',
                params: { channelId: 321, n: 3 }, status: 200, data: messages1
            })
            expect( store.getState().notifications ).toEqual({
                ...state.notifications, channels: {
                    321: 3
                }
            })
        })
        test('should set notifications when there are already messages', () => {
            store.dispatch({
                network: 'http', resource: '/message/all', type: 'GET',
                params: { channelId: 123, n: 3 }, status: 200, data: messages2
            })
            expect( store.getState().notifications ).toEqual({
                ...state.notifications, channels: {
                    321: 3,
                    123: 3
                }
            })
        })

    })
    test('local clearNotifications action', () => {
        const state = {
            ...reducer(undefined, {}),
            channels: {
                123: 42,
                999: 12
            }
        }
        expect(
            reducer(state, actions.clear(123))
        ).toEqual({
            ...state, channels: {
                123: 0,
                999: 12
            }
        })
    })
})