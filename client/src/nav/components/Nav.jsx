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
    componentDidMount = (prevProps, prevState) => {
        if(!this.props.auth.token){
            this.props.push('/login')
        }
    }
    
    render() {
        const { auth } = this.props
        console.log(auth)
        return (
            <nav className={css.Nav}>
                <p>{auth.userId}</p>
                <p>settings</p>
            </nav>
        )
    }
}

export default connect(mapState, mapDispatch)(Nav)