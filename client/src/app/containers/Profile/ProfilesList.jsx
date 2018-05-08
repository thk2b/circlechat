import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { push } from 'react-router-redux'
import LoadingBar from '../../lib/LoadingBar';

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

const ProfilesList = ({ profiles, loading,  goToProfile, afterItemClick }) => {
    return <Ul className="sidebar">
        {loading&&<LoadingBar/>}
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
    </Ul>
}

export default connect(mapState, mapDispatch)(ProfilesList)