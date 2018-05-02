import React from 'react'
import { connect } from 'react-redux'

import { push } from 'react-router-redux'

const mapState = ({ profiles }) => {
    return {
        profiles: Object.values(profiles)
    }
}

const mapDispatch = dispatch => {
    return {
        goToProfile: id => dispatch(push(`/profile/${id}`))
    }
}

const ProfilesSidebar = ({ profiles, goToProfile }) => {
    return (
        <ul
            className='sidebar'
        >{profiles.map(
            profile => <li
                key={profile.id}
                onClick={e => goToProfile(profile.id)}
            >
                <p>{profile.name}</p>                
            </li>
        )}</ul>
    )
}

export default connect(mapState, mapDispatch)(ProfilesSidebar)