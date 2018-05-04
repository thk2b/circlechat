import React from 'react'
import { connect } from 'react-redux'

import { profilesActions } from '../../../store/modules/profiles'
import UserName from './UserName'
import Description from './Description'

const mapState = ({ profiles }, { match }) => {
    return {
        profile: profiles[match.params.id]
    }
}

const mapDispatch = dispatch => {
    return {
        updateProfile: (id, data) => dispatch(profilesActions.update(id, data))
    }
}

const mergeProps = ({ profile }, { updateProfile }) => {
    return {
        profile,
        onUpdateProfile: data => updateProfile(profile.id, data)
    }
}

const Profile = ({ profile, onUpdateProfile }) => {
    if(!profile) return <main>
        <p>profile not found</p>
    </main>

    return <main>
        <UserName 
            name={profile.name}
            onSubmit={name => onUpdateProfile({name})}
        />
        <h2>@{profile.userId}</h2>
        <Description
            description={profile.description}
            onSubmit={description => onUpdateProfile({description})}
        />
    </main>
}

export default connect(mapState, mapDispatch, mergeProps)(Profile)