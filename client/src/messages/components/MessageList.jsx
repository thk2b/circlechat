import React from 'react'

import Message from './Message'
import './styles/MessageList.css'

export default ({ messages }) => (
    <ul className="MessageList">{ messages.map(
        message => <Message 
            key={ message.id } 
            {...message}
        />
    )}</ul>
)