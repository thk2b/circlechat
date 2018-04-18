import * as messageActions from '../../messages'

import * as actions from  '../actions'
import reducer from '../reducer'

import createStore from '../../../'

describe('notifications reducer', () => {
    test('local clear action', () => {
        const state = {
            ...reducer(undefined, {}),
            channels: {
                123: 42,
                999: 12
            },
            total: 54
        }
        expect(
            reducer(state, actions.clear(123))
        ).toEqual({
            ...state, channels: {
                123: 0,
                999: 12
            },
            total: 12
        })
    })
    describe('local increment action', () => {
        const state = {
            ...reducer(undefined, {}),
            channels: {
                123: 42,
                999: 12
            },
            total: 54
        }
        test('it should increment by 1 by default', () => {
            expect(
                reducer(state, actions.increment(123))
            ).toEqual({
                ...state, channels: {
                    123: 43,
                    999: 12
                },
                total: 55
            })
        })
        test('it should increment by n', () => {
            expect(
                reducer(state, actions.increment(123, 10))
            ).toEqual({
                ...state,
                channels: {
                    123: 52,
                    999: 12
                },
                total: 64
            })
        })
    })
})