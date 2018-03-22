import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import AccountCircleIcon from 'material-ui-icons/AccountCircle'
import IconButton from 'material-ui/IconButton'

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
        <AccountCircleIcon/>
    </IconButton>
}

export default connect(mapState, mapDispatch)(OwnProfileLink)