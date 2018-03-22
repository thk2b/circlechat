import React from 'react'

import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

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
        this.props.onSubmit(this.state)
    }
    render() {
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <Typography variant='subheading'>Register</Typography>
                <TextField 
                    label='user id'
                    value={this.state.userId}
                    onChange={({ target }) => this.setState({ userId: target.value })}
                    margin='normal'
                />
                <TextField 
                    label='email'
                    value={this.state.email}
                    onChange={({ target }) => this.setState({ email: target.value })}
                    margin='normal'
                />
                <TextField
                    type='password'
                    label='password'
                    value={this.state.pw}
                    onChange={({ target }) => this.setState({ pw: target.value })}
                    onKeyDown={({ key }) => !this.props.isTextarea && key === 'Enter' && this.handleSubmit()}
                    margin='normal'
                />
                <div>
                    <Button 
                        color='primary'
                        variant='raised'
                        onClick={e => this.handleSubmit(e)}
                    >
                        Register
                    </Button>
                    <Button
                        onClick={e => this.props.onSecondary(e)}
                    >
                        Log in
                    </Button>
                </div>
            </form>
        )
    }
}