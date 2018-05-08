import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import LoadingBar from '../../lib/LoadingBar'
import { profilesActions } from '../../../store/modules/profiles'
import UserName from './UserName'
import Description from './Description'
import OnlineStatus from './OnlineStatus'

const mapState = ({ profiles, loading, errors }, { match }) => {
    const { id } = match.params
    return {
        profile: profiles[id],
        loading: loading.profiles[id],
        errors: errors.profiles[id],
    }
}

const mapDispatch = dispatch => {
    return {
        updateProfile: (id, data) => dispatch(profilesActions.update(id, data))
    }
}

const mergeProps = ({ profile, ...state }, { updateProfile }) => {
    return {
        profile,
        onUpdateProfile: data => updateProfile(profile.id, data),
        ...state,
    }
}

const Main = styled.main`
    position: relative;
`

const Profile = ({ profile, loading, onUpdateProfile }) => {
    if(!profile) return <main>
        <p>profile not found</p>
    </main>

    return <Main>
        {loading&&<LoadingBar/>}
        <UserName 
            name={profile.name}
            onSubmit={name => onUpdateProfile({name})}
        />
        <h2>@{profile.userId}{profile.status==='ONLINE'&&<OnlineStatus/>}</h2>
        <Description
            description={profile.description}
            onSubmit={description => onUpdateProfile({description})}
        />
    </Main>
}

export default connect(mapState, mapDispatch, mergeProps)(Profile)