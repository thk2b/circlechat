import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import MdAdd from 'react-icons/lib/md/add'
import { push } from 'react-router-redux'

import { NotificationPill } from '../../lib'
import LabeledIcon from '../../lib/LabeledIcon'
import ChannelListItem from './ChannelListItem'

const mapState = ({ channels, notifications, loading, errors }) => {
    return {
        channels: Object.values(channels),
        notifications,
        loading: loading.channels.all,
        error: errors.channels.all,
    }
}

const mapDispatch = dispatch => {
    return {
        goToChannel: id => dispatch(push(`/channel/${id}`)),
        goToCreateChannel: () => dispatch(push(`/channel/create`))
    }
}

const Container = styled.div`
    display: flex;
    flex-flow: column nowrap;
    max-height: 100%;
`

const Ul = styled.ul`
    flex: 1;
    overflow-y: auto;
`

const Footer = styled.footer`
    text-align: center;
    padding: 10px;
`

const ChannelsList = ({
    channels, notifications,
    goToChannel, goToCreateChannel, afterItemClick
}) => {
    return <Container className="sidebar">
        <Ul>
            {channels.map(
                channel => <ChannelListItem
                    channel={channel}
                    key={channel.id}
                    onClick={e => {
                        goToChannel(channel.id)
                        afterItemClick&&afterItemClick(e)
                    }}
                />
            )}
        </Ul>
        <Footer>
            <LabeledIcon
                Icon={() => <MdAdd size={32} />}
                labelText="create channel"
                onClick={e => {
                    goToCreateChannel()
                    afterItemClick&&afterItemClick(e)
                }}
            />
        </Footer>
    </Container>
}

export default connect(mapState, mapDispatch)(ChannelsList)