import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ profiles }, { match }) => {
    return {
        profile: profiles[match.params.id]
    }
}

const ProfileHeader = ({ profile }) => {
    if(!profile) return <header>
        <h2>profile not found</h2>
    </header>
    const { name } = profile
    return <header>
        <h2>{name}</h2>
    </header>
}

export default connect(mapState)(ProfileHeader)