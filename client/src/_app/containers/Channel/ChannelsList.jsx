import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { push } from 'react-router-redux'
import { NotificationPill } from '../../lib'


const mapState = ({ channels, notifications }) => {
    return {
        channels: Object.values(channels),
        notifications
    }
}

const mapDispatch = dispatch => {
    return {
        goToChannel: id => dispatch(push(`/channel/${id}`))
    }
}

const Li = styled.li`
    display: flex;
    justify-content: space-between;
`

const ChannelsList = ({ channels, notifications, goToChannel }) => {
    return <ul>
        {channels.map(
            channel => <Li
                key={channel.id}
                onClick={e => goToChannel(channel.id)}
            >
                <p>{channel.name}</p>
                <NotificationPill count={notifications.channels[channel.id]}/>
            </Li>
        )}
    </ul>
}

export default connect(mapState, mapDispatch)(ChannelsList)