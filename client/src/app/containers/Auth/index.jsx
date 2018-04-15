import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar'
import { CircularProgress } from 'material-ui/Progress'

import { login, connectWs, register, clearRequestStatus } from '../../../store/modules/auth'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import css from './Auth.css'
import { LinearProgress } from 'material-ui';

const mapState = ({ auth, device }) => {
    const { token, request, loading, ws } = auth
    return {
        request, token, loading, ws, device
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
            this.props.clearRequestStatus()
            // if(this.props.token && !this.props.ws.loading && !this.props.ws.connected){
            //     //TODO: move to middleware
            //     this.props.connectWs()    
            // }
        }
    }
    
    toggleRegister = () => {
        this.setState({ isRegistering: !this.state.isRegistering})
        this.props.clearRequestStatus()
    }

    render() {
        const { request, loading, login, register, token, device } = this.props
        const { isRegistering } = this.state
        
        if(token) return this.props.children
        
        return <div className={css.Auth}>
            <Typography variant='title'>Welcome to CircleChat !</Typography>
            <Paper elevation={device.isMobile? 0 : 3}>
                {
                    isRegistering
                        ?<RegisterForm onSubmit={data => register(data)} onSecondary={e => this.toggleRegister()}/>
                        :<LoginForm onSubmit={login} onSecondary={e => this.toggleRegister()}/>
                }
                {loading && <LinearProgress />}
                {request.status && <Snackbar
                    open={true}
                    message={request.message}
                    autoHideDuration={4000}
                />}
            </Paper>
        </div>
    }
}

export default connect(mapState, mapDispatch)(Auth)
