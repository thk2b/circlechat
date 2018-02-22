import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { getAll } from '../actions'
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
        ...bindActionCreators({ getAll }, dispatch),
        goToProfile: id => dispatch(push('/profile/'+id)),
    }
}

class ProfilesList extends React.Component {
    componentDidMount = () => {
        if(this.props.profiles.length <= 1){
            this.props.getAll()
        }
    }
    
    render() {
        return this.props.profiles.map(
            p => <ProfileListItem
                key={p.id}
                onClick={e => this.props.goToProfile(p.id)}
                name={p.name}
            />
        )
    }
}

export default connect(mapState, mapDispatch)(ProfilesList)