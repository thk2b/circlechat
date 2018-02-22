import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { RequestStatus, Spinner } from '../../lib/components'

import { login, loginWs, register, clearRequestStatus } from '../actions'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import css from './Auth.css'

const mapState = ({ auth }) => {
    const { token, request, loading } = auth
    return {
        request, token, loading
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        login,
        loginWs,
        register,
        clearRequestStatus
    }, dispatch)
}

class Auth extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isRegistering: false }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.request.status && this.props.request.status < 400){
            if(!this.props.isRegistering){
                return this.toggleRegister()
            }
            // this.props.token && this.props.loginWs(this.props.token)
        }
    }
    
    toggleRegister = () => {
        this.setState({ isRegistering: !this.state.isRegistering})
        this.props.clearRequestStatus()
    }

    render() {
        const { request, loading, login, register, token } = this.props
        const { isRegistering } = this.state
        
        if(token) return this.props.children
        
        return (
            <div className={css.Auth}>
                {
                    isRegistering
                        ?<RegisterForm onSubmit={data => register(data)} onSecondary={e => this.toggleRegister()}/>
                        :<LoginForm onSubmit={login} onSecondary={e => this.toggleRegister()}/>
                }
                {loading && <Spinner>loading</Spinner>}
                <RequestStatus request={request}/>
            </div>
        )
    }
}

export default connect(mapState, mapDispatch)(Auth)
