import React from 'react'
import { connect } from 'react-redux'
import MdPerson from 'react-icons/lib/md/person'

import { push } from 'react-router-redux'

const mapState = ({ profiles, ownProfileId }) => {
    return {
        ownProfileId,
        ownProfile: profiles[ownProfileId]
    }
}

const mapDispatch = dispatch => {
    return {
        goToUrl: url => dispatch(push(url))
    }
}

const mergeProps = ({ ownProfileId, ...state }, { goToUrl }) => {
    return {
        goToOwnProfile: () => goToUrl(`/profile/${ownProfileId}`),
        ...state
    }
}

const OwnProfileLink = ({ ownProfile, goToOwnProfile }) => {
    return (
        <div
            onClick={e => goToOwnProfile()}
        >
            <MdPerson
                size={32}
            />
        </div>
    )
}

export default connect(mapState, mapDispatch, mergeProps)(OwnProfileLink)