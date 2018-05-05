import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { authActions } from '../../../store/modules/auth'
import { errorsActions } from '../../../store/modules/errors'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const mapState = ({ loading, errors }) => {
    return {
        registerError: errors.auth.register,
        loginError: errors.auth.login,
        registerLoading: loading.auth.register,
        loginLoading: loading.auth.login,
    }
}

const mapDispatch = dispatch => {
    return {
        onLogin: data => dispatch(authActions.login(data)),
        onRegister: data => dispatch(authActions.register(data)),
        clearRegisterError: () => dispatch(errorsActions.clearRegisterError()),
        clearLoginError: () => dispatch(errorsActions.clearLoginError())
    }
}

const Main = styled.main`
    padding-top: 10%;
    & form {
        background-color: transparent !important;
    }
`

class Auth extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loginData: { userId: '', pw: '' },
            registerData: { userId: '', email: '', pw: '' },
            isRegistering: false
        }
        this.didLogin = false
        this.didRegister = false
    }
    handleLogin(){
        this.props.clearLoginError()
        this.props.onLogin(this.state.loginData)
        this.didLogin = true
    }
    handleRegister(){
        this.props.clearRegisterError()
        this.props.onRegister(this.state.registerData)
        this.didRegister = true
    }
    onAfterRegister(){
        this.didRegister = false
        this.props.clearLoginError()
        this.setState({
            registerData: { userId: '', email: '', pw: '' },
            loginData: {
                ...this.state.loginData,
                userId: this.state.registerData.userId
            },
            isRegistering: false
        })
    }
    toggleRegister(){
        this.setState({
            isRegistering: !this.state.isRegistering
        })
    }
    componentDidUpdate(prevProps, prevState){
        const { registerLoading, registerError } = this.props
        if(registerLoading || registerError ) return
        if(this.didRegister){
            this.onAfterRegister()
        }
    }
    render(){
        const { isRegistering, loginData, registerData } = this.state
        const {
            loginError, registerError,
            loginLoading, registerLoading,
        } = this.props

        return <Main>
            {isRegistering
                ? <RegisterForm
                    formData={registerData}
                    onChange={registerData => this.setState({ registerData })}
                    onSubmit={() => this.handleRegister()}
                    onSecondary={() => this.toggleRegister()}
                    error={registerError}
                    loading={registerLoading}
                />
                : <LoginForm
                    formData={loginData}
                    onChange={loginData => this.setState({ loginData })}
                    onSubmit={() => this.handleLogin()}
                    onSecondary={() => this.toggleRegister()}
                    error={loginError}
                    loading={loginLoading}
                />
            }
        </Main>
    }
}

export default connect(mapState, mapDispatch)(Auth)