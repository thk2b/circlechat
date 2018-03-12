import React, { Component } from 'react'

import { Input, InputWithButtons, Button } from '../../lib'

export default class MessageInput extends Component {
    constructor(props){
        super(props)
        this.state = { text: ''}
    }
    submit = () => {
        this.state.text && this.props.onSubmit(this.state.text)
        this.setState({ text: '' })
    }
    render() {
        return <InputWithButtons>
            <Input
                onClick={e => this.props.onFocus(e)}
                value={this.state.text}
                onChange={text => this.setState({ text })}
                onKeyDown={({ key }) => key === 'Enter' && this.submit()}
            />
            <Button
                onClick={e => this.submit()}
                >send
            </Button>
        </InputWithButtons>
    }
}
