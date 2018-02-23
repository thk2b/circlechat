import React from 'react'
import { connect } from 'react-redux'
import { update } from '../actions'

const mapState = ({ profiles }) => {
    const ownProfile = profiles.data[profiles.ownProfileId]
    return {
        status: ownProfile && ownProfile.status
    }
}

const mapDispatch = dispatch => {
    return {}
}

class OwnProfile extends React.Component {    
    render() {
        return <div>
            {this.props.status}
        </div>
    }
}

export default connect(mapState, mapDispatch)(OwnProfile)