import React from 'react'

import './styles/Message.css'

export default ({ id, text, createdAt }) => (
    <li className = "Message">
        <p>{ createdAt }</p>
        <p>{ text }</p>
    </li>
)