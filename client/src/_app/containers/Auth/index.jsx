import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const mapState = ({}) => {
    return {}
}

const mapDispatch = (dispatch) => {
    return {}
}

const Container = styled.div``

class Auth extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loginData: { userId: null, pw: null },
            registerData: { userId: null, pw: null },
            isRegistering: false
        }
    }
    render(){
        const { isRegistering, loginData, registerData } = this.state
        const {
            onLogin, onRegister,
            loginError, registerError,
            loginLoading, registerLoading
        } = this.props

        return <Container>
            {isRegistering
                ? <RegisterForm
                    onChange={registerData => this.setState({ registerData })}
                    onSubmit={() => onRegiter(registerData)}
                    error={registerError}
                    loading={registerLoading}
                />
                : <LoginForm
                    onChange={loginData => this.setState({ loginData })}
                    onSubmit={() => onLogin(loginData)}
                    error={loginError}
                    loading={loginLoading}
                />
            }
        </Container>
    }
}

export default connect(mapState, mapDispatch)(Auth)