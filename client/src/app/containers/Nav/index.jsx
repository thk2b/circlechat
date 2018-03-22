import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import { OwnProfileLink, Settings } from '../'

const mapDispatch = dispatch => {
    return bindActionCreators({ push }, dispatch)
}

class Nav extends React.Component {
    render() {
        return <AppBar>
            <Toolbar>
                <Settings />
                <Typography variant='title'>
                    CircleChat
                </Typography> 
                <OwnProfileLink />
            </Toolbar>
        </AppBar>
    }
}

export default connect(undefined, mapDispatch)(Nav)