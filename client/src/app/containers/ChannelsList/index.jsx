import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import MdAddCircle from 'react-icons/lib/md/add-circle'

import { Link } from '../../lib'
import { clearNotifications } from '../../../store/modules/notifications'

import ChannelListItem from './ChannelListItem'

const mapState = ({ channels, notifications }) => {
    return {
        channels: Object.entries(channels.data).map(
            ([_, channel]) => ({
                ...channel,
                notifications: notifications.channels[channel.id]
            })
        ),
        request: channels.request
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push, clearNotifications }, dispatch)
}

class ChannelsList extends React.Component {
    onListItemClick = channelId => {
        this.props.push(`/channel/${channelId}`)
        this.props.clearNotifications(channelId)
    }
    render(){
        const { channels, push } = this.props
        return channels.map(
            channel => <ChannelListItem
                key={channel.id}
                onClick={e => this.onListItemClick(channel.id)}
                {...channel}
            />
        ).concat(<Link
            key='__createLink'
            onClick={e => push('/channel/create')}
            ><MdAddCircle/>
        </Link>)
    }
}

export default connect(mapState, mapDispatch)(ChannelsList)
