import React from 'react'

import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import RequestStatus from '../../lib/RequestStatus'

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            userId: '',
            pw: ''
        }
    }
    handleSubmit = e => {
        // e.preventDefault()
        this.props.onSubmit(this.state)
    }
    render() {
        const { error, onSecondary } = this.props
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <Typography variant='subheading'>Log in</Typography>
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
                {error && <RequestStatus request={error} />}
                <br/>
                <div>
                    <Button 
                        color='primary'
                        variant="raised"
                        onClick={e => this.handleSubmit(e)}
                    > login 
                    </Button>
                    <Button
                        onClick={e => onSecondary(e)}
                    > register
                    </Button>
                </div>
            </form>
        )
    }
}