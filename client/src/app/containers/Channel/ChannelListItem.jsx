import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import NotificationPill from '../../lib/NotificationPill'

const Li = styled.li`
    position: relative;
    & span {
        position: absolute;
        right: 15px;
        top: calc(50% - 10px);
    }
    & p {
        font-size: 15px;
        min-height: 15px;
    }
`

const Row = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
`

const mapState = ({ channels, messages, profiles, notifications, hasMore }, { channel }) => {
    const messagesInChannel = Object.keys(messages).filter(
        messageId => messages[messageId].channelId === channel.id
    )
    const lastMessage = messages[messagesInChannel[messagesInChannel.length-1]]
    return {
        channel,
        lastMessage,
        lastMessageProfile: profiles[lastMessage&&lastMessage.profileId],
        notifications: notifications.channels[channel&&channel.id],
    }
}

const ChannelListItem = ({ channel, lastMessage, lastMessageProfile, onClick, notifications }) => {
    return <Li
        onClick={onClick}
    >
        <NotificationPill count={notifications}/>
        <Row>
            <h3>{channel.name}</h3>
        </Row>
        <Row>
            <p>{lastMessageProfile && lastMessage && 
                `${lastMessageProfile.name}: ${lastMessage.text}` || null
            }</p>
        </Row>
    </Li>
}

export default connect(mapState)(ChannelListItem)