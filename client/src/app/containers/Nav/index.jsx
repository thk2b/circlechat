import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import Link from '../../lib/Link'
import { OwnProfileLink, Settings } from '../'

 
import css from './Nav.css'

const mapState = ({ auth }) => {
    return { auth }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ push }, dispatch)
}

class Nav extends React.Component {
    render() {
        const { auth } = this.props
        return (
            <nav className={css.Nav}>
                <Settings />
                <Link onClick={e=>this.props.push('/')}>home</Link>
                <OwnProfileLink />
            </nav>
        )
    }
}

export default connect(mapState, mapDispatch)(Nav)