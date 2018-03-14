import React from 'react'
import autoscroll from 'autoscroll-react'

import Message from './Message'

export default autoscroll(class Messages extends React.Component {
    render() {
        const { messages, ...rest } = this.props
        return <ul
            {...rest}
        >
            { messages.map(
                message => <Message key={message.id} {...message}/>
            )}
        </ul>
    }
})