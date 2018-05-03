import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ channels }, { match }) => {
    return {
        channel: channels[match.params.id]
    }
}

const ChannelHeader = ({ channel }) => {
    if(!channel) return <header>
        <h2>channel not found</h2>
    </header>

    return <header>
        <h2>{channel.name}</h2>
    </header>
}

export default connect(mapState)(ChannelHeader)