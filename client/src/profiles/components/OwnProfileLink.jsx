import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Link from '../../lib/components/Link'

import { getProfileOfUser } from '../actions'

const mapState = ({ profiles, auth }) => {
    return {
        userId: auth.userId,
        ownProfileId: profiles.ownProfileId
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push, getProfileOfUser }, dispatch)
}

class OwnProfileLink extends React.Component {
    componentDidMount = () => {
        if(!this.props.ownProfileId){
            this.props.getProfileOfUser(this.props.userId)
        }
    }
    render() {
        return <Link onClick={e => {
            if(this.props.userId) this.props.push('/me')
        }}>
            {this.props.userId}
        </Link>
    }
}

export default connect(mapState, mapDispatch)(OwnProfileLink)