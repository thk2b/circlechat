import React from 'react'
import { connect } from 'react-redux'

import Message from './Message'

const mapState = ({ messages }, { channelId }) => {
    return {
        messages: Object.values(messages).filter(
            message => message.channelId === channelId
        )
    }
}

const Messages = ({ messages }) => {
    return <ul>
        {messages.map(
            message => <Message message={message} />
        )}
    </ul>
}

export default connect(mapState)(Messages)
