import validateOutgoingNetworkAction from '../validateOutgoingNetworkAction'

describe('validateOutgoingNetworkAction', () => {
    test('it should invalidate invalid actions', () => {
        expect(validateOutgoingNetworkAction({
            wrong: 'oops'
        })).toBe(false)
        expect(validateOutgoingNetworkAction({
            network: 'wrong',
            type: 'POST',
            resource: 'some/url',
            data: { data: 'data' }
        })).toBe(false)
    })
    test('it should validate valid actions without a data key', () => {
        expect(validateOutgoingNetworkAction({
            network: 'http',
            type: 'POST',
            resource: 'some/url'
        })).toBe(true)
    })
    test('it should validate valid actions with a data key', () => {
        expect(validateOutgoingNetworkAction({
            network: 'http',
            type: 'POST',
            resource: 'some/url',
            data: { data: 'data' }
        })).toBe(true)
    })
})