import React from 'react'

import Info from '../Info'

export default ({ request }) => {
    return (
        <div>
            {request.status && (
            request.status >= 400
                ? <Info danger>{request.message}</Info>
                : <Info success>{request.message}</Info>
            )}
        </div>
    )
}
