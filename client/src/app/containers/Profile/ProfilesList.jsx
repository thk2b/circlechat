import React from 'react'
import { connect } from 'react-redux'

import { push } from 'react-router-redux'

const mapState = ({ profiles, loading, errors }) => {
    return {
        profiles: Object.values(profiles),
        loading: loading.profiles.all,
        error: errors.profiles.all,
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
                    afterItemClick&&afterItemClick(e)
                }}
            >
                <p>{profile.name}</p>                
            </li>
        )}
    </ul>
}

export default connect(mapState, mapDispatch)(ProfilesList)