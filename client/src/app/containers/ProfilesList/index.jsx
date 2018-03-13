import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import ProfileListItem from './ProfileListItem'

const mapState = ({ profiles }) => {
    return {
        profiles: Object.keys(profiles.data).reduce(
            (arr, id) => [...arr, profiles.data[id]]
        ,[])
    }
}
const mapDispatch = dispatch => {
    return {
        goToProfile: id => dispatch(push('/profile/'+id)),
    }
}

class ProfilesList extends React.Component {
    render() {
        return this.props.profiles.map(
            p => <ProfileListItem
                key={p.id}
                onClick={e => this.props.goToProfile(p.id)}
                name={p.name}
                status={p.status}
            />
        )
    }
}

export default connect(mapState, mapDispatch)(ProfilesList)