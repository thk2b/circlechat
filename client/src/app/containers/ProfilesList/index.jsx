import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import List from 'material-ui/List/List'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Subheader from 'material-ui/Subheader'

import css from './ProfilesList.css'
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
        this.props.resetSwipeableIndex&&this.props.resetSwipeableIndex()
    } 
    render() {
        return <div className={css.ProfilesList}>
            <Toolbar>
                <ToolbarTitle text="profiles"/>
            </Toolbar>
            <List>
            {this.props.profiles.map(
                p => <ProfileListItem
                    key={p.id}
                    onClick={e => this.handleItemClick(p.id)}
                    name={p.name}
                    status={p.status}
                />
            )}
            </List>
        </div>
        // return <List className={css.ProfilesList}>
        //     {this.props.showHeader && <Subheader>Profiles</Subheader>}
        //     {this.props.profiles.map(
        //         p => <ProfileListItem
        //             key={p.id}
        //             onClick={e => this.handleItemClick(p.id)}
        //             name={p.name}
        //             status={p.status}
        //         />
        //     )}
        // </List>
    }
}

export default connect(mapState, mapDispatch)(ProfilesList)