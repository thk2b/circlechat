import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

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
                <p onClick={e=>this.props.push('/me')}>{auth.userId}</p>
                <p>settings</p>
            </nav>
        )
    }
}

export default connect(mapState, mapDispatch)(Nav)