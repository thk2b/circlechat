import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ profiles }, { match }) => {
    return {
        profile: Object.values(profiles).filter(
            p => p.id === match.params.id
        )
    }
}

const mapDispatch = dispatch => {
    return {

    }
}

const Profile = ({ profile }) => {
    const { } = profile
    return (
        <main>
        </main>
    )
}

export default connect(mapState, mapDispatch)(Profile)