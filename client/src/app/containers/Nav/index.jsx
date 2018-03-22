import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import { OwnProfileLink, Settings } from '../'

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push }, dispatch)
}

class Nav extends React.Component {
    render() {
        const { classes } = this.props
        return <AppBar className={classes.root}>
            <Toolbar>
                <Settings />
                <Typography variant='title'
                    color="inherit"
                    className={classes.flex}
                >
                    CircleChat
                </Typography> 
                <OwnProfileLink />
            </Toolbar>
        </AppBar>
    }
}

export default withStyles(styles)(connect(undefined, mapDispatch)(Nav))