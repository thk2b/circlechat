import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ profiles }, { match }) => {
    return {
        profile: profiles[match.params.id]
    }
}

const Profile = ({ profile }) => {
    if(!profile) return <main>
        <p>profile not found</p>
    </main>

    const { userId, name, status, description } = profile
    return <main>
        <h1>{name}'s profile</h1>
        <h2>@{userId}</h2>
        {description&&<p>{description}</p>}
    </main>
}

export default connect(mapState)(Profile)