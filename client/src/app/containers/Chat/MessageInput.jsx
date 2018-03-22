import React, { Component } from 'react'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import SendIcon from 'material-ui-icons/Send'

import css from './MessageInput.css'

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
        return <div className={css.MessageInput}>
            <TextField
                fullWidth
                value={this.state.text}
                onClick={e => this.props.onFocus(e)}
                onChange={({ target }) => this.setState({ text: target.value })}
                onKeyDown={({ key }) => key === 'Enter' && this.submit()}
            />
            <Button mini
                variant='fab'
                onClick={e => this.submit()}
            >
                <SendIcon />
            </Button>
        </div>
    }
}
