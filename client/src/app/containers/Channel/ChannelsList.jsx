import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import MdAdd from 'react-icons/lib/md/add'
import { push } from 'react-router-redux'

import LabeledIcon from '../../lib/LabeledIcon'
import ChannelListItem from './ChannelListItem'
import { notificationsActions } from '../../../store/modules/notifications'
import LoadingBar from '../../lib/LoadingBar'

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
        goToCreateChannel: () => dispatch(push(`/channel/create`)),
        clearNotifications: id => dispatch(notificationsActions.clear(id))
    }
}

const Container = styled.div`
    display: flex;
    flex-flow: column nowrap;
    max-height: 100%;
    position: relative;
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
    channels, notifications, clearNotifications, loading,
    goToChannel, goToCreateChannel, afterItemClick
}) => {
    return <Container className="sidebar">
        {loading&&<LoadingBar/>}
        <Ul>
            {channels.map(
                channel => <ChannelListItem
                    channel={channel}
                    key={channel.id}
                    onClick={e => {
                        goToChannel(channel.id)
                        clearNotifications(channel.id)
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