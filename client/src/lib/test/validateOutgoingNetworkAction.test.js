import validateOutgoingNetworkAction from '../validateOutgoingNetworkAction'

describe('validateOutgoingNetworkAction', () => {
    test('it should invalidate invalid actions', () => {
        expect(validateOutgoingNetworkAction({
            wrong: 'oops'
        })).toBe(false)
        expect(validateOutgoingNetworkAction({
            network: 'wrong',
            type: 'POST',
            url: 'some/url',
            payload: { data: 'data' }
        })).toBe(false)
    })
    test('it should validate valid actions', () => {
        expect(validateOutgoingNetworkAction({
            network: 'http',
            type: 'POST',
            url: 'some/url',
            payload: { data: 'data' }
        })).toBe(true)
    })
})