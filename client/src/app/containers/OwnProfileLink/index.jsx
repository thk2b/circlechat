import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import AccountIcon from 'material-ui/svg-icons/action/account-circle'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import OwnStatus from '../OwnStatus'

// import css from './OwnProfileLink.css'

const mapState = ({ profiles, auth }) => {
    return {
        userId: auth.userId,
        ownProfileId: profiles.ownProfileId,
        request: profiles.request
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push }, dispatch)
}

const OwnProfileLink = ({ push, userId }) => {
    return <IconButton
        onClick={e => {
            if(userId) push('/me')
        }}
    >
        <AccountIcon/>
    </IconButton>
}

export default connect(mapState, mapDispatch)(OwnProfileLink)