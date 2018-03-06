import React from 'react'
import { connect } from 'react-redux'

import { Status } from '../../lib'

const mapState = ({ profiles }) => {
    const ownProfile = profiles.data[profiles.ownProfileId]
    return {
        status: ownProfile && ownProfile.status
    }
}

const mapDispatch = dispatch => {
    return {}
}

export default connect(mapState, mapDispatch)(Status)