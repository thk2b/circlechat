import React from 'react'
import { connect } from 'react-redux'

import Chat from './Chat'

const mapState = ({ channels}, { match }) => {
    return {
        channel: channels[match.params.id]
    }
}

const Channel = ({ channel }) => {
    if(!channel) return <main>
        channel not found
    </main>
    return <Chat channelId={channel.id}/>
}

export default connect(mapState)(Channel)