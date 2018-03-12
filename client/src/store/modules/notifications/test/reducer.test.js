import * as messageActions from '../../messages'

import * as actions from  '../actions'
import reducer from '../reducer'

describe('notifications reducer', () => {
    describe('incoming POST /message', () => {
        let state = reducer(undefined, {})
        const message1 = {
            text: 'test message', profileId: 123, channelId: 321, id: 123
        }
        const message2 = {
            text: 'test message', profileId: 123, channelId: 321, id: 123
        }
        test('should be one when the message is the first message', () => {
            const newState = reducer(state, {
                network: 'ws', resource: '/message', type: 'POST',
                status: 201, data: { message: message1 }
            })
            expect(
                newState
            ).toEqual({
                ...state,
                channels: {
                    321: 1
                }
            })
            state = newState
            
        })
        test('should increment when there are already notifications', () => {
            expect(
                reducer(state, {
                    network: 'ws', resource: '/message', type: 'POST',
                    status: 201, data: { message: message2 }
                })
            ).toEqual({
                ...state,
                channels: {
                    321: 2
                }
            })
        })
        // test('should not increment for the user\'s own messages' , () => {
        //     expect(
        //         reducer(state, {
        //             network: 'ws', resource: '/message', type: 'POST',
        //             status: 201, data: { message: message2 }
        //         })
        //     ).toEqual({
        //         ...state,
        //         channels: {
        //             321: 2
        //         }
        //     })
        // })
        
    })
    describe('incoming GET /message/all', () => {
        let state = reducer(undefined, {})
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
            const newState = reducer(state, {
                network: 'http', resource: '/message/all', type: 'GET',
                params: { channelId: 321, n: 3 }, status: 200, data: messages1
            })
            expect( newState ).toEqual({
                ...state, channels: {
                    321: 3
                }
            })
            state = newState
        })
        test('should set notifications when there are already messages', () => {
            const newState = reducer(state, {
                network: 'http', resource: '/message/all', type: 'GET',
                params: { channelId: 123, n: 3 }, status: 200, data: messages2
            })
            expect( newState ).toEqual({
                ...state, channels: {
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
            reducer(state, actions.clearNotifications(123))
        ).toEqual({
            ...state, channels: {
                123: 0,
                999: 12
            }
        })
    })
})