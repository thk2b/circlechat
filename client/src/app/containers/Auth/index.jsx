import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui';

import { login, register } from '../../../store/modules/auth/networkActions'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import css from './Auth.css'

const mapState = ({ auth, device, loading, errors }) => {
    return {
        loginError: errors.auth.login,
        registerError: errors.auth.register,
        loginLoading: loading.auth.login,
        registerLoading: loading.auth.register,
        isAuthenticated: !!auth.token,
        device
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        onLogin: login,
        onRegister: register,
    }, dispatch)
}

class Auth extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isRegistering: false }
    }

    componentDidUpdate = (prevProps, prevState) => {
        /* if we succesfully registered */
        if(
            prevProps.registerLoading &&
            !this.props.registerLoading &&
            !this.props.registerError
        ){
            if(this.state.isRegistering){
                return this.setState({ isRegistering: false })
            }
        }
    }
    
    toggleRegister = () => {
        this.setState({ isRegistering: !this.state.isRegistering})
    }

    render() {
        if(this.props.isAuthenticated){
            return 'authenticated!'
            // return this.props.children
        }
        const {
            loginLoading, registerLoading,
            loginError, registerError,
            onLogin, onRegister,
            device
        } = this.props
        const { isRegistering } = this.state
        
        return <div className={css.Auth}>
            <Typography variant='title'>Welcome to CircleChat !</Typography>
            <Paper elevation={device.isMobile? 0 : 3}>
                {isRegistering
                    ?<RegisterForm
                        error={registerError}
                        onSubmit={onRegister}
                        onSecondary={e => this.toggleRegister()}
                    />
                    :<LoginForm
                        error={loginError}
                        onSubmit={onLogin}
                        onSecondary={e => this.toggleRegister()}
                    />
                }
                {(loginLoading || registerLoading) && <LinearProgress />}
            </Paper>
        </div>
    }
}

export default connect(mapState, mapDispatch)(Auth)
