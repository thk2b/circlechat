import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Link from '../../lib/components/Link'

import { getProfileOfUser, create } from '../actions'

const mapState = ({ profiles, auth }) => {
    return {
        userId: auth.userId,
        ownProfileId: profiles.ownProfileId,
        request: profiles.request
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push, getProfileOfUser, create }, dispatch)
}

const mergeProps = ({ userId, ...state }, { create, getProfileOfUser, ...dispatch }) => {
    return {
        getOwnProfile: () => getProfileOfUser(userId),
        createOwnProfile: () => create({ userId }),
        ...state, userId, ...dispatch
    }
}

class OwnProfileLink extends React.Component {
    componentDidMount = () => {
        if(!this.props.ownProfileId){
            this.props.getOwnProfile()
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.request.status === 404){
            this.props.createOwnProfile()
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

export default connect(mapState, mapDispatch, mergeProps )(OwnProfileLink)