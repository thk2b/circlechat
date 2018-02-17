import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Input, Button } from '../lib/components'

import { login, register } from './actions'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import css from './Auth.css'

class Auth extends React.Component {
    constructor(props) {
      super(props)
      this.state = { isRegistering: false }
    }
    
    toggleRegister = () => this.setState({ isRegistering: !this.state.isRegistering})

    render() {
        const { login, register } = this.props
        const { isRegistering } = this.state

        return (
        <div className={css.Auth}>{
            isRegistering
                ?<RegisterForm onSubmit={data => register(data)} onSecondary={e => this.toggleRegister()}/>
                :<LoginForm onSubmit={login} onSecondary={e => this.toggleRegister()}/>
        }</div>
    )
  }
}

const mapState = state => {
    return {}
}

const mapDispatch = dispatch => {
    return bindActionCreators({ login, register }, dispatch)
}

export default connect(mapState, mapDispatch)(Auth)
