import React from 'react'
import { connect } from 'react-redux'

import { push } from 'react-router-redux'

const mapState = ({ profiles, ownProfileId }) => {
    return {
        ownProfileId,
        ownProfile: profiles[ownProfileId]
    }
}

const mapDispatch = dispatch => {
    return {
        push: url => dispatch(push(url))
    }
}

const mergeProps = ({ ownProfileId, ...state }, { push }) => {
    return {
        goToOwnProfile: push(ownProfileId),
        ...state
    }
}

const OwnProfileLink = ({ ownProfile, goToOwnProfile }) => {
    return (
        <div
            onClick={e => goToOwnProfile()}
        >
            {ownProfile.name}
        </div>
    )
}

export default connect(mapState, mapDispatch)(OwnProfileLink)