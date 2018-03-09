import React from 'react'

import Info from '../Info'

export default ({ request }) => {
    return request.status && (
        request.status >= 400
            ? <Info danger>{request.message}</Info>
            : <Info success>{request.message}</Info>
    )
}
