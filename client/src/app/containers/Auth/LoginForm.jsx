import React from 'react'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            userId: '',
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
                <h3>Log in</h3>
                <TextField
                    floatingLabelText="id or email"
                    value={this.state.userId}
                    onChange={({ target }) => this.setState({ userId: target.value })}
                />
                <TextField
                    type="password"
                    floatingLabelText="password"
                    value={this.state.pw}
                    onChange={({ target }) => this.setState({ pw: target.value })}
                />
                <br/>
                <div>
                    <RaisedButton primary
                        label='login'
                        onClick={e => this.handleSubmit(e)}
                    />
                    <FlatButton
                        label='register'
                        onClick={e => this.props.onSecondary(e)}
                    />
                </div>
            </form>
        )
    }
}