import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Messages from './Messages'
import MessageInput from './MessageInput'

const Container = styled.main`
    display: flex;
    flex-flow: column nowrap;

    & ul {
        flex: 1;
    }
`

export default ({ channelId }) => {
    return <Container>
        <Messages channelId={channelId}/>
        <MessageInput channelId={channelId}/>
    </Container>
}