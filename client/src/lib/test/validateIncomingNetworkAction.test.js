import validateIncomingNetworkAction from '../validateIncomingNetworkAction'

describe('validateIncomingNetworkAction', () => {
    test('it should invalidate invalid actions', () => {
        expect(validateIncomingNetworkAction({
            wrong: 'oops'
        })).toBe(false)
        expect(validateIncomingNetworkAction({
            network: 'wrong',
            type: 'POST',
            resource: 'some/url',
            status: 201,
            data: { data: 'data' }
        })).toBe(false)
    })
    test('it should validate valid actions', () => {
        expect(validateIncomingNetworkAction({
            network: 'http',
            type: 'POST',
            resource: 'some/url',
            status: 201,
            data: { data: 'data' }
        })).toBe(true)
    })
})