import React from 'react'
import { connect } from 'react-redux'

import Messages from './Messages'

export default ({ channelId }) => {
    return <Messages channelId={channelId}/>
}
