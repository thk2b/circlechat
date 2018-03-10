import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autoScroll from 'autoscroll-react'

import { send, getInChannel } from '../../../store/modules/messages'
import { clearNotifications } from '../../../store/modules/notifications'

import css from './Chat.css'
import Message from './Message'
import MessageInput from './MessageInput'

const mapState = ({ messages, profiles }, { channelId }) => {
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
    return bindActionCreators({ clearNotifications, getInChannel, send }, dispatch)
}

const mergeProps = ({ profileId, ...state}, actions, { channelId }) => {
    return {
        ...state,
        clearNotifications: () => actions.clearNotifications( channelId ),
        getMessages: after => actions.getInChannel( channelId, after ), /* after is the message ID of the last message we have. Pass it when we fetch additional messages */
        sendMessage: text => actions.send({ channelId, profileId, text })
    }
}

class Chat extends React.Component {
    componentDidMount = () => {
    //   console.log('mount')
    }
    
    componentDidUpdate = () => {
        // console.log('update')
        // this.props.clearNotifications()
    }
    render() {
        const { messages, sendMessage } = this.props
        return <div className={css.Chat}>
            <ul>
                {messages.map(
                    message => <Message key={message.id} {...message}/>
                )}
            </ul>
            <MessageInput
                onSubmit={text => sendMessage(text)}
            />
        </div>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(Chat)