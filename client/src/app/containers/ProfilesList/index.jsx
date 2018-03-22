import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import { withStyles } from 'material-ui/styles'
import List from 'material-ui/List'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import css from './ProfilesList.css'
import ProfileListItem from './ProfileListItem'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
    }
})

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
        const { profiles, showHeader, classes } = this.props
        return <div className={css.ProfilesList + ' ' + classes.root}>
            {showHeader && <Toolbar>
                <Typography>profiles</Typography>
            </Toolbar>}
            <List>
            {profiles.map(
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

export default withStyles(styles)(connect(mapState, mapDispatch)(ProfilesList))