import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import List from 'material-ui/List/List'
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
    handleItemClick = profileId => {
        this.props.goToProfile(profileId)
        this.props.resetSwipeableIndex()
    } 
    render() {
        return <List>
            {this.props.profiles.map(
                p => <ProfileListItem
                    key={p.id}
                    onClick={e => this.handleItemClick(p.id)}
                    name={p.name}
                    status={p.status}
                />
            )}
        </List>
    }
}

export default connect(mapState, mapDispatch)(ProfilesList)