import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { withStyles } from 'material-ui/styles'

import { send, getInChannel } from '../../../store/modules/messages/networkActions'
import { actions as notificationsActions } from '../../../store/modules/notifications'
import Messages from './Messages'
import MessageInput from './MessageInput'
import css from './Chat.css'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default
    }
})

const mapState = ({ messages, profiles, hasMore }, { channelId }) => {
    return {
        messages: Object.entries(messages)
            .filter(
                ([_, message]) => message.channelId === channelId
            ).map(
                ([_, message]) => message
            ),
        request: messages.request,
        profileId: profiles.ownProfileId,
        hasMore: hasMore.channels[channelId] || true
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        clearNotifications: notificationsActions.clear,
        getInChannel,
        send
    }, dispatch)
}

const mergeProps = ({ profileId, ...state}, actions, { channelId, ...ownProps }) => {
    return {
        ...state,
        clearNotifications: () => actions.clearNotifications( channelId ),
        getMoreMessages: () => actions.getInChannel( channelId, state.messages[0].id ), /* fetch additional messages posted before the first mesasge we have */
        sendMessage: text => actions.send({ channelId, profileId, text }),
        ...ownProps
    }
}

class Chat extends React.Component {
    render() {
        const {
            classes,
            messages, hasMore,
            sendMessage, clearNotifications, getMoreMessages
        } = this.props
        return <div
            className={css.Chat + ' ' + classes.root}
        >
            <Messages
                messages={messages}
                onScrolledTop={e => hasMore && getMoreMessages()}
            />
            <MessageInput
                onSubmit={text => sendMessage(text)}
                onFocus={e => clearNotifications()}
            />
        </div>
    }
}

export default withStyles(styles)(connect(mapState, mapDispatch, mergeProps)(Chat))