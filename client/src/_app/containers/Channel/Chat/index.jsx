import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Messages from './Messages'
import MessageInput from './MessageInput'

const Container = styled.div`

`

export default ({ channelId }) => {
    return <Container>
        <Messages channelId={channelId}/>
        <MessageInput channelId={channelId}/>
    </Container>
}
