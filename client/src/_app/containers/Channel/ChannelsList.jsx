import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { push } from 'react-router-redux'
import { NotificationPill } from '../../lib'
import MdAdd from 'react-icons/lib/md/add'


const mapState = ({ channels, notifications }) => {
    return {
        channels: Object.values(channels),
        notifications
    }
}

const mapDispatch = dispatch => {
    return {
        goToChannel: id => dispatch(push(`/channel/${id}`)),
        goToCreateChannel: () => dispatch(push(`/channel/create`))
    }
}

const Container = styled.ul`
    display: flex;
    flex-flow: column nowrap;
`

const Footer = styled.footer`
    text-align: center;
    padding: 10px;
`

const ChannelsList = ({
    channels, notifications,
    goToChannel, goToCreateChannel, afterItemClick
}) => {
    return <Container>
        <ul>
            {channels.map(
                channel => <li
                    key={channel.id}
                    onClick={e => {
                        goToChannel(channel.id)
                        afterItemClick(e)
                    }}
                >
                    <p>{channel.name}</p>
                    <NotificationPill count={notifications.channels[channel.id]}/>
                </li>
            )}
        </ul>
        <Footer>
            <MdAdd
                size={32}
                onClick={e => {
                    goToCreateChannel()
                    afterItemClick(e)
                }}
            />
        </Footer>
    </Container>
}

export default connect(mapState, mapDispatch)(ChannelsList)