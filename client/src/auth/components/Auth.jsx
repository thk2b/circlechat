import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Info, Spinner } from '../../lib/components'

import { push } from 'react-router-redux'
import { login, loginWs, register, clearRequestStatus } from '../actions'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import css from './Auth.css'

class Auth extends React.Component {
    constructor(props) {
      super(props)
      this.state = { isRegistering: false }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.success){
            if(this.props.isRegistering){
                return this.toggleRegister()
            }
            this.props.token && this.props.loginWs(this.props.token)
            return this.props.push('/')
        }
    }
    
    toggleRegister = () => {
        this.setState({ isRegistering: !this.state.isRegistering})
        this.props.clearRequestStatus()
    }

    render() {
        const { error, success, loading, login, register } = this.props
        const { isRegistering } = this.state
        return (
        <div className={css.Auth}>
            {
                isRegistering
                    ?<RegisterForm onSubmit={data => register(data)} onSecondary={e => this.toggleRegister()}/>
                    :<LoginForm onSubmit={login} onSecondary={e => this.toggleRegister()}/>
            }
            {loading && <Spinner>loading</Spinner>}
            {error && <Info danger>{error.message}</Info>}
            {success && <Info success>{success.message}</Info>}
        </div>
    )
  }
}

const mapState = ({ auth }) => {
    const { token, error, success, loading } = auth
    return {
        error, success, token, loading
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        login,
        loginWs,
        register,
        clearRequestStatus,
        push
    }, dispatch)
}

export default connect(mapState, mapDispatch)(Auth)
