import React, { Component } from 'react'

import TextField from 'material-ui/TextField'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import SendIcon from 'material-ui/svg-icons/content/send'
import { Input, InputWithButtons, Button } from '../../lib'

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
                hintText='send a message'
                onClick={e => this.props.onFocus(e)}
                onChange={({ target }) => this.setState({ text: target.value })}
                onKeyDown={({ key }) => key === 'Enter' && this.submit()}
            />
            <FloatingActionButton mini
                onClick={e => this.submit()}
            >
                <SendIcon />
            </FloatingActionButton>
        </div>

        // return <InputWithButtons>
        //     <Input
        //         onClick={e => this.props.onFocus(e)}
        //         value={this.state.text}
        //         onChange={text => this.setState({ text })}
        //         onKeyDown={({ key }) => key === 'Enter' && this.submit()}
        //     />
        //     <Button
        //         onClick={e => this.submit()}
        //         >send
        //     </Button>
        // </InputWithButtons>
    }
}
