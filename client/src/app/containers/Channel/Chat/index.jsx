import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Messages from './Messages'
import MessageInput from './MessageInput'

import { messagesActions } from '../../../../store/modules/messages'
import { notificationsActions } from '../../../../store/modules/notifications'

const mapState = ({ messages, ownProfileId, hasMore, loading, errors }, { channelId }) => {
    return {
        messages: Object.entries(messages)
            .filter(
                ([_, message]) => message.channelId === channelId
            ).map(
                ([_, message]) => message
            ),
        ownProfileId,
        hasMore: hasMore.channels[channelId] || true,
        loading: loading.messages.new,
        error: errors.messages.new,
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        clearNotifications: notificationsActions.clear,
        getInChannel: messagesActions.getInChannel,
        send: messagesActions.send
    }, dispatch)
}

const mergeProps = ({ ownProfileId, ...state}, actions, { channelId, ...ownProps }) => {
    return {
        ...state,
        ownProfileId,
        clearNotifications: () => actions.clearNotifications( channelId ),
        getMoreMessages: () => actions.getInChannel( channelId, state.messages[0] && state.messages[0].id ), /* fetch additional messages posted before the first mesasge we have */
        sendMessage: text => actions.send({ channelId, profileId: ownProfileId, text }),
        ...ownProps
    }
}



const Chat = ({
    messages, hasMore, loading, error, ownProfileId,
    sendMessage, clearNotifications, getMoreMessages
}) => {
    return <React.Fragment>
        <Messages
            messages={messages}
            ownProfileId={ownProfileId}
            onScrolledTop={e => hasMore && getMoreMessages()}
        />
        <MessageInput 
            onSubmit={text => sendMessage(text)}
            onFocus={e => clearNotifications()}
            loading={loading}
            error={error}    
        />
    </React.Fragment>
}

export default connect(mapState, mapDispatch, mergeProps)(Chat)