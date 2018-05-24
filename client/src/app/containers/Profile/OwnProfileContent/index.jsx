import React from 'react'
import { connect } from 'react-redux'
import { profilesActions } from '../../../../store/modules/profiles'

import UserName from './UserName'
import Description from './Description'
import OnlineStatus from '../OnlineStatus'

const OwnProfileContent = ({ profile, onUpdateProfile }) => {
    return <React.Fragment>
        <UserName
            name={profile.name}
            onSubmit={name => onUpdateProfile({name})}
        />
        <h2>@{profile.userId}{profile.status==='ONLINE'&&<OnlineStatus/>}</h2>
        <Description
            description={profile.description}
            onSubmit={description => onUpdateProfile({description})}
        />
    </React.Fragment>    
}

const mapDispatch = dispatch => {
    return {
        updateProfile: (id, data) => dispatch(profilesActions.update(id, data))
    }
}

const mergeProps = (_, { updateProfile }, { profile, ...props }) => {
    return {
        profile,
        onUpdateProfile: data => updateProfile(profile.id, data),
        ...props,
    }
}

export default connect(undefined, mapDispatch, mergeProps)(OwnProfileContent)