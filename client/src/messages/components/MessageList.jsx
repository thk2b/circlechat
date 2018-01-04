import React from 'react'

import Autoscroll from 'autoscroll-react'
import Message from './Message'
import './styles/MessageList.css'

class MessageList extends React.Component{
    render(){
        const { messages, ...rest } = this.props
        return (
            <ul 
                className="MessageList" 
                { ...rest }
            >{ 
                messages.map(
                    message => <Message 
                        key={ message.id } 
                        {...message}
                    />
                )
            }</ul>
        )
    }
}

export default Autoscroll(MessageList)