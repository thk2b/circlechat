import React from 'react'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            userId: '',
            pw: ''
        }
    }
    handleSubmit = e => {
        this.props.onSubmit(this.state)
    }
    render() {
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <h3>Log in</h3>
                <TextField
                    label="user id"
                    value={this.state.userId}
                    onChange={({ target }) => this.setState({ userId: target.value })}
                    margin='normal'
                />
                <TextField
                    type="password"
                    label="password"
                    value={this.state.pw}
                    onChange={({ target }) => this.setState({ pw: target.value })}
                    onKeyDown={({ key }) => !this.props.isTextarea && key === 'Enter' && this.handleSubmit()}
                />
                <br/>
                <div>
                    <Button 
                        color='primary'
                        variant="raised"
                        onClick={e => this.handleSubmit(e)}
                    >
                        login
                    </Button>
                    <Button
                        onClick={e => this.props.onSecondary(e)}
                    >
                        register
                    </Button>
                </div>
            </form>
        )
    }
}