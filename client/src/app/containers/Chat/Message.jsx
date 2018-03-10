import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import { Link } from '../../lib'

import { update, remove } from '../../../store/modules/messages'

import css from './Message.css'

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
    id, text, profileName, createdAt, updatedAt,
    updateMessage, removeMessage, goToProfile
}) => {
    return <article className={css.Message}>
        <p>{ text }</p>
        <p>
            <Link onClick={e => goToProfile()}>{ profileName }</Link>
            <span> at { createdAt }</span>
            {(createdAt !== updatedAt) && <span>updated at { updatedAt }</span>}
        </p>
    </article>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)