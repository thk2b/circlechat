import React from 'react'
import autoscroll from 'autoscroll-react'

import Message from './Message'

export default autoscroll(class Messages extends React.Component {
    componentDidMount = () => {
        console.log('mount')
    }
    
    render() {
        const { messages } = this.props
        return <ul
            {...this.props}
        >
            { messages.map(
                message => <Message key={message.id} {...message}/>
            )}
        </ul>
    }
})