import React from 'react'
import { connect } from 'react-redux'

import Chat from './Chat'

const mapState = ({ channels, loading, errors }, { match }) => {
    const { id } = match.params
    return {
        channel: channels[match.params.id],
        loading: loading.channels[id],
        error: errors.channels[id],
    }
}

const Channel = ({ channel }) => {
    if(!channel) return <main>
        channel not found
    </main>
    return <Chat channelId={channel.id}/>
}

export default connect(mapState)(Channel)