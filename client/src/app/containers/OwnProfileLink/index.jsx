import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Link from '../../lib/Link'
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
    return <Link onClick={e => {
        if(userId) push('/me')
    }}>
        <span>{ userId }</span>  
        <OwnStatus />
    </Link>
}

export default connect(mapState, mapDispatch)(OwnProfileLink)