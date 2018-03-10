import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import { update, remove } from '../../../store/modules/messages'

const mapState = ({ profiles }, { profileId }) => {
    const profile = profiles.data[profileId]
    return {
        profileName: profile && profile.name
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ update, remove, push }, dispatch)
}

const mergeProps = (state, actions, ownProps ) => {
    return {
        ...state,
        ...ownProps,
        updateMessage: text => actions.update(ownProps.id, { text }),
        deleteMessage: () => actions.remove(ownProps.id),
        goToProfile: () => actions.push(`/profile/${ownProps.profileId}`)
    }
}

const Message = ({
    id, text, profileName, sentAt, updatedAt,
    updateMessage, removeMessage, goToProfile
}) => {
    return <div>
        {JSON.stringify({id, text, profileName, sentAt, updatedAt})}
    </div>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)