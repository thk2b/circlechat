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
    return {
        setOnlineStatus: () => dispatch(update({ status: 'ONLINE' }))
    }
}

class OwnProfile extends React.Component {
    componentDidMount = () => {
        if(this.props.status === 'OFFLINE'){
            this.props.setOnlineStatus()
        }
    }
    componentWillUnmount = () => {
        console.log('bye')
    }
    
    render() {
        return <div>
            {this.props.status}
        </div>
    }
}

export default connect(mapState, mapDispatch)(OwnProfile)