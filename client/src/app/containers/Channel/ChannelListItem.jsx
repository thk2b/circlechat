import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import NotificationPill from '../../lib/NotificationPill'

const Li = styled.li`
    & h3 {

    }
    & p {
        font-size: 15px;
        min-height: 15px;
    }
`

const Row = styled.div`
    display: flex;
    flex-flow: row nowrap;
`

const mapState = ({ channels, messages, profiles, notifications }, { channel }) => {
    const messagesInChannel = Object.keys(messages).filter(
        messageId => messages[messageId].channelId === channel.id
    )
    const lastMessage = messages[messagesInChannel[messagesInChannel.length-1]]
    return {
        channel,
        lastMessage,
        lastMessageProfile: profiles[lastMessage&&lastMessage.profileId]
    }
}

const ChannelListItem = ({ channel, lastMessage, lastMessageProfile, onClick, notifications }) => {
    return <Li
        onClick={onClick}
    >
        <Row>
            <h3>{channel.name}</h3>
            <NotificationPill count={notifications&&notifications.channels[channel.id]}/>
        </Row>
        <Row>
            <p>{lastMessageProfile && lastMessage && 
                `${lastMessageProfile.name}: ${lastMessage.text}` || null
            }</p>
        </Row>
    </Li>
}

export default connect(mapState)(ChannelListItem)