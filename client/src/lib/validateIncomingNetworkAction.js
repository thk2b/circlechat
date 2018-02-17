import { assert } from 'duck-check'

export default assert({
    network: s => s === 'http' || s === 'ws',
    resource: String,
    type: String,
    status: Number,
    data: {}
})