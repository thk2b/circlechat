import validateIncomingNetworkAction from '../validateIncomingNetworkAction'

describe('validateIncomingNetworkAction', () => {
    test('it should invalidate invalid actions', () => {
        expect(validateIncomingNetworkAction({
            wrong: 'oops'
        })).toBe(false)
        expect(validateIncomingNetworkAction({
            network: 'wrong',
            type: 'POST',
            url: 'some/url',
            status: 201,
            payload: { data: 'data' }
        })).toBe(false)
    })
    test('it should validate valid actions', () => {
        expect(validateIncomingNetworkAction({
            network: 'http',
            type: 'POST',
            url: 'some/url',
            status: 201,
            payload: { data: 'data' }
        })).toBe(true)
    })
})