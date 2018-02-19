import { assert, oneOf } from 'duck-check'

export default assert({
    network: s => s === 'http' || s === 'ws',
    resource: String,
    type: String,
    data: oneOf({}, undefined)
})