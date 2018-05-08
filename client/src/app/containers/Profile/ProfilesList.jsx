import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import LoadingBar from '../../lib/LoadingBar'
import OnlineStatus from './OnlineStatus'

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

const Ul = styled.ul`
    position: relative;
`

const Li = styled.li`
    display: flex;
    align-items: center;
`

const ProfilesList = ({ profiles, loading,  goToProfile, afterItemClick }) => {
    return <Ul className="sidebar">
        {loading&&<LoadingBar/>}
        {profiles.map(
            profile => <Li
                key={profile.id}
                onClick={e => {
                    goToProfile(profile.id)
                    afterItemClick&&afterItemClick(e)
                }}
            >
                <p>{profile.name}</p>
                {profile.status === 'ONLINE' && <OnlineStatus/>}
            </Li>
        )}
    </Ul>
}

export default connect(mapState, mapDispatch)(ProfilesList)