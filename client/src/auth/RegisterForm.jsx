import React from 'react'

import { Input, Button } from '../lib/components'

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
                <Input 
                    placeholder="user id"
                    value={this.state.userId}
                    onChange={userId => this.setState({ userId })}
                />
                <Input 
                    placeholder="email"
                    value={this.state.email}
                    onChange={email => this.setState({ email })}
                />
                <Input
                    type="password"
                    placeholder="password"
                    value={this.state.pw}
                    onChange={pw => this.setState({ pw })}
                />
                <Button onClick={e => this.handleSubmit(e)}>Register</ Button>
                <Button 
                    underlined 
                    onClick={e => this.props.onSecondary(e)}
                >Log in</ Button>
            </form>
        )
    }
}