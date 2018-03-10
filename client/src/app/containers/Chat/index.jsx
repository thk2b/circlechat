import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { send, getInChannel } from '../../../store/modules/messages'

import Message from './Message'
import MessageInput from './MessageInput'

const mapState = ({ messages, profiles }, { channelId }) => {
    // console.log(Object.entries(messages.data))
    return {
        messages: Object.entries(messages.data)
            .filter(
                ([_, message]) => message.channelId === channelId
            ).map(
                ([_, message]) => message
            ),
        request: messages.request,
        profileId: profiles.ownProfileId
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ getInChannel, send }, dispatch)
}

const mergeProps = ({ profileId, ...state}, actions, { channelId }) => {
    return {
        ...state,
        getMessages: after => actions.getInChannel( channelId, after ), /* after is the message ID of the last message we have. Pass it when we fetch additional messages */
        sendMessage: text => actions.send({ channelId, profileId, text })
    }
}

class Chat extends React.Component {
    componentDidMount = () => {
        if(this.props.request.status === null){
            this.props.getMessages()
        }
    }
    
    render() {
        const { messages, sendMessage } = this.props
        return <div>
            {messages.map(
                message => <Message key={message.id} {...message}/>
            )}
            <MessageInput
                onSubmit={text => sendMessage(text)}
            />
        </div>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(Chat)