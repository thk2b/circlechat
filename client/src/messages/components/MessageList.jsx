import React from 'react'

import Message from './Message'
import './styles/MessageList.css'

export default ({ messages }) => (
    <ul className="MessageList">{ 
        messages.reverse().map(
            message => <Message 
                key={ message.id } 
                {...message}
            />
        )
    }</ul>
)