import React from 'react'
import { connect } from 'react-redux'
import MdPerson from 'react-icons/lib/md/person'
import { push } from 'react-router-redux'

import LabeledIcon from '../../lib/LabeledIcon'

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

const mergeProps = ({ ownProfileId, ...state }, { goToUrl }, ownProps ) => {
    return {
        goToOwnProfile: () => goToUrl(`/profile/${ownProfileId}`),
        ...state,
        ...ownProps
    }
}

const OwnProfileLink = ({ ownProfile, goToOwnProfile, onClick }) => {
    return (
        <div
            onClick={e => {
                goToOwnProfile()
                onClick()
            }}
        >
            <LabeledIcon
                Icon={() => <MdPerson size={32}/>}
                labelText="profile"
            />
        </div>
    )
}

export default connect(mapState, mapDispatch, mergeProps)(OwnProfileLink)