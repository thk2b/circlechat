import React from 'react'

import { Input, Button } from '../../lib'

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
                <h1>Log in</h1>
                <Input
                    placeholder="id or email"
                    value={this.state.userId}
                    onChange={userId => this.setState({ userId })}
                />
                <Input
                    type="password"
                    placeholder="password"
                    value={this.state.pw}
                    onChange={pw => this.setState({ pw })}
                />
                <Button primary onClick={e => this.handleSubmit(e)}>Log in</ Button>
                <Button 
                    underlined 
                    onClick={e => this.props.onSecondary(e)}
                >Register</ Button>
            </form>
        )
    }
}