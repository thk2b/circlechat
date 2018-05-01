import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ profiles }, { match }) => {
    return {
        profile: Object.values(profiles).filter(
            p => p.id === match.id
        )
    }
}

const mapDispatch = dispatch => {
    return {

    }
}

const ProfileHeader = ({ profile }) => {
    const { } = profile
    return (
        <header>

        </header>
    )
}

export default connect(mapState, mapDispatch)(ProfileHeader)