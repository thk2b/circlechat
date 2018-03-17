import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import Link from '../../lib/Link'
import { OwnProfileLink, Settings } from '../'
 
import css from './Nav.css'

const mapDispatch = dispatch => {
    return bindActionCreators({ push }, dispatch)
}

class Nav extends React.Component {
    render() {
        return (
            <nav className={css.Nav}>
                <Settings />
                <Link onClick={e=>this.props.push('/')}>home</Link>
                <OwnProfileLink />
            </nav>
        )
    }
}

export default connect(undefined, mapDispatch)(Nav)