import React from 'react'
import { connect } from 'react-redux'

import { push } from 'react-router-redux'

const mapState = ({ channels }) => {
    return {
        channels: Object.values(channels)
    }
}

const mapDispatch = dispatch => {
    return {
        goToChannel: id => dispatch(push(`/channel/${id}`))
    }
}

const ChannelsSidebar = ({ channels, goToChannel }) => {
    return (
        <ul
            className='sidebar'
        >{channels.map(
            channel => <li
                key={channel.id}
                onClick={e => goToChannel(channel.id)}
            >
                <p>{channel.name}</p>
            </li>
        )}</ul>
    )
}

export default connect(mapState, mapDispatch)(ChannelsSidebar)