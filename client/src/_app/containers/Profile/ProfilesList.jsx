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

const ProfilesList = ({ profiles, goToProfile, afterItemClick }) => {
    return <ul className="sidebar">
        {profiles.map(
            profile => <li
                key={profile.id}
                onClick={e => {
                    goToProfile(profile.id)
                    afterItemClick(e)
                }}
            >
                <p>{profile.name}</p>                
            </li>
        )}
    </ul>
}

export default connect(mapState, mapDispatch)(ProfilesList)