import { assert, oneOf } from 'duck-check'

export default assert({
    network: s => s === 'http' || s === 'ws',
    url: String,
    type: String,
    payload: {}
})