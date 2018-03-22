import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import List from 'material-ui/List'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'

import { clear as clearNotifications } from '../../../store/modules/notifications'

import css from './ChannelsList.css'
import ChannelListItem from './ChannelListItem'

const mapState = ({ channels, notifications, hasMore }) => {
    return {
        channels: Object.entries(channels.data).map(
            ([_, channel]) => ({
                ...channel,
                notifications: notifications.channels[channel.id]
            })
        ),
        request: channels.request,
        hasMore
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push, clearNotifications }, dispatch)
}

class ChannelsList extends React.Component {
    onListItemClick = channelId => {
        this.props.push(`/channel/${channelId}`)
        this.props.resetSwipeableIndex&&this.props.resetSwipeableIndex()
        this.props.clearNotifications(channelId)
    }
    onCreateButtonClick = () => {
        this.props.push('/channel/create')
        this.props.resetSwipeableIndex&&this.props.resetSwipeableIndex()
    }
    render(){
        const { channels, hasMore, showHeader } = this.props
        return <div className={css.ChannelsList}>
            {showHeader && <Toolbar>
                <Typography variant='title'>channels</Typography>
            </Toolbar>}
            <List>
                {channels.map(
                    channel => <ChannelListItem
                        key={channel.id}
                        onClick={e => this.onListItemClick(channel.id)}
                        hasMore={hasMore.messages[channel.id]}
                        {...channel}
                    />
                )}
            </List>
            <Button mini
                variant='fab'
                className={css.CreateChannelButton}
                onClick={e => this.onCreateButtonClick()}
            >
                <AddIcon/>
            </Button>
        </div>
    }
}

export default connect(mapState, mapDispatch)(ChannelsList)
