import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import LoadingBar from '../../lib/LoadingBar'

import OwnProfileContent from './OwnProfileContent'
import ProfileContent from './ProfileContent'


const mapState = ({ profiles, ownProfileId, loading, errors }, { match }) => {
    const { id } = match.params
    return {
        profile: profiles[id],
        isOwnProfile: parseInt(id) === ownProfileId,
        loading: loading.profiles[id],
        errors: errors.profiles[id],
    }
}

const Main = styled.main`
    position: relative;

    & h1 {
        display: inline-block;
    }
`

const Profile = ({ profile, isOwnProfile, loading, onUpdateProfile }) => {
    if(!profile) return <main>
        <p>profile not found</p>
    </main>

    return <Main>
        {loading&&<LoadingBar/>}
        {isOwnProfile
            ? <OwnProfileContent profile={profile} />
            : <ProfileContent profile={profile}/>
        }
    </Main>
}

export default connect(mapState)(Profile)