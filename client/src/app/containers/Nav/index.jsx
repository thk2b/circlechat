import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import AppBar from 'material-ui/AppBar'
import { OwnProfileLink, Settings } from '../'

const mapDispatch = dispatch => {
    return bindActionCreators({ push }, dispatch)
}

class Nav extends React.Component {
    render() {
        return <AppBar
            iconElementLeft={<Settings />}
            title='CircleChat'
            iconElementRight={<OwnProfileLink />}
        />
    }
}

export default connect(undefined, mapDispatch)(Nav)