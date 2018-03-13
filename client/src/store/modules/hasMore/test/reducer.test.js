import reducer from '../reducer'

describe('hasMore reducer', () => {
    describe('messages', () => {
        const state = reducer(undefined, {})
        const messages = {
            1: { text: 'test message', profileId: 123, channelId: 321, id: 1 },
            2: { text: 'test message', profileId: 123, channelId: 321, id: 2 },

            3: { text: 'test message', profileId: 123, channelId: 432, id: 3 },
            4: { text: 'test message', profileId: 123, channelId: 432, id: 4 },
            5: { text: 'test message', profileId: 123, channelId: 432, id: 5 },

            6: { text: 'test message', profileId: 123, channelId: 543, id: 6 }
        }

        test('should work upon recieving message/all?n=', () => {
            expect(
                reducer(state, {
                    network: 'http', type: 'GET', resource: '/message/all',
                    status: 200,
                    data: messages, params: { n: 3 }
                })
            ).toEqual({
                ...state,
                messages: {
                    ...state.messages,
                    321: false,
                    432: true,
                    543: false
                }
            })
        })
        test('should work upon recieving message/all?channelId=&n=', () => {
            const initialState = {
                ...state, messages: {
                    999: true, 111: false
                }
            }
            expect(
                reducer(initialState, {
                    network: 'http', type: 'GET', resource: '/message/all',
                    status: 200,
                    data: { 3: messages[3], 4: messages[4], 5: messages[5] },
                    params: { channelId: 432, n: 3 }
                })
            ).toEqual({
                ...initialState,
                messages: {
                    ...initialState.messages,
                    432: true,
                }
            })
        })
    })
})