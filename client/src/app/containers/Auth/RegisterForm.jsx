import React from 'react'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            userId: '',
            email: '',
            pw: ''
        }
    }
    handleSubmit = e => {
        e.preventDefault()
        this.props.onSubmit(this.state)
    }
    render() {
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <h1>Register</h1>
                <TextField 
                    floatingLabelText="user id"
                    hintText="Your permanant id"
                    value={this.state.userId}
                    onChange={({ target }) => this.setState({ userId: target.value })}
                />
                <TextField 
                    floatingLabelText="email"
                    value={this.state.email}
                    onChange={({ target }) => this.setState({ email: target.value })}
                />
                <TextField
                    type="password"
                    floatingLabelText="password"
                    hintText="Pick a strong password"
                    value={this.state.pw}
                    onChange={({ target }) => this.setState({ pw: target.value })}
                />
                <div>
                    <RaisedButton primary
                        label="Register"
                        onClick={e => this.handleSubmit(e)}
                    />
                    <FlatButton
                        label="Log in"
                        onClick={e => this.props.onSecondary(e)}
                    />
                </div>
            </form>
        )
    }
}