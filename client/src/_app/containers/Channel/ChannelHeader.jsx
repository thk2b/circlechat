import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ channels }, { match }) => {
    return {
        profile: Object.values(channels).filter(
            p => p.id === match.params.id
        )
    }
}

const mapDispatch = dispatch => {
    return {

    }
}

const ChannelHeader = ({ profile }) => {
    const { } = profile
    return (
        <header>

        </header>
    )
}

export default connect(mapState, mapDispatch)(ChannelHeader)