import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Chat from './Chat'
import LoadingBar from '../../lib/LoadingBar'

const mapState = ({ channels, loading, errors }, { match }) => {
    const { id } = match.params
    return {
        channel: channels[match.params.id],
        loading: loading.channels[id],
        error: errors.channels[id],
    }
}

const Main = styled.main`
    display: flex;
    flex-flow: column nowrap;
    position: relative;
`
const Channel = ({ channel, loading }) => {
    if(!channel) return <Main>
        channel not found
    </Main>
    return <Main>
        {loading&&<LoadingBar/>}
        <Chat channelId={channel.id}/>
    </Main>
}

export default connect(mapState)(Channel)