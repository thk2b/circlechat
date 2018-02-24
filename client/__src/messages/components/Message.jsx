import React from 'react'

import './styles/Message.css'

export default ({ id, text, created_at }) => (
    <li className = "Message">
        <p>{ created_at }</p>
        <p>{ text }</p>
    </li>
)