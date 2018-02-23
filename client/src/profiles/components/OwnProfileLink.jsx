import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Link from '../../lib/components/Link'
import OwnStatus from './OwnStatus'
import { getProfileOfUser, create } from '../actions'
import profile from './profile.svg'
import css from './OwnProfileLink.css'

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

const mergeProps = ({ userId, ...state }, { create, getProfileOfUser, ...dispatch }, ownProps) => {
    return {
        getOwnProfile: () => getProfileOfUser(userId),
        createOwnProfile: () => create({ userId }),
        ...state, userId, ...dispatch, ...ownProps
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
        console.log(this.props.children)
        return <Link onClick={e => {
            if(this.props.userId) this.props.push('/me')
        }}>
            <img className={css.ProfileIcon}
                src={profile} 
                alt="profile icon"
            />
            <small>{this.props.userId}</small>  
            <OwnStatus />
        </Link>
    }
}

export default connect(mapState, mapDispatch, mergeProps )(OwnProfileLink)