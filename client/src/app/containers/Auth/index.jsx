import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import { RequestStatus, Spinner } from '../../lib'

import { login, connectWs, register, clearRequestStatus } from '../../../store/modules/auth'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import css from './Auth.css'

const mapState = ({ auth }) => {
    const { token, request, loading, ws } = auth
    return {
        request, token, loading, ws
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        login,
        connectWs,
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
            if(this.state.isRegistering){
                return this.setState({ isRegistering: false })
            }

            if(this.props.token && !this.props.ws.loading && !this.props.ws.connected){
                this.props.connectWs()
                this.props.clearRequestStatus()
            }
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
            <Paper className={css.Auth} zDepth={3}>
                <h2>Welcome to CircleChat !</h2>
                {
                    isRegistering
                        ?<RegisterForm onSubmit={data => register(data)} onSecondary={e => this.toggleRegister()}/>
                        :<LoginForm onSubmit={login} onSecondary={e => this.toggleRegister()}/>
                }
                {loading && <Spinner>loading</Spinner>}
                <RequestStatus request={request}/>
            </Paper>
        )
    }
}

export default connect(mapState, mapDispatch)(Auth)
