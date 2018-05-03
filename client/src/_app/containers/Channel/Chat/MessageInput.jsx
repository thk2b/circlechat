import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { messagesActions } from '../../../../store/modules/messages'

const mapState = ({ ownProfileId }) => {
    return { ownProfileId }
}

const mapDispatch = dispatch => {
    return {
        send: data => dispatch(messagesActions.send(data))
    }
}

const mergeProps = ({ ownProfileId }, { send }, { channelId }) => {
    return {
        onSend: text => send({ profileId: ownProfileId, channelId, text })
    }
}

const Form = styled.form`
    display: flex;
    padding: 15px;
    background-color: #444546;
    & input {
        padding: 10px;
        flex: 1;
        border-right-width: 0 !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }
    & button {
        border: none !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;

    }

`

class MessageInput extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: ''
        }
    }
    handleSend(e){
        e.preventDefault()
        if(!this.state.value) return
        this.props.onSend(this.state.value)
        this.setState({ value: ''})
    }
    render(){
        return <Form
            onSubmit={e => this.handleSend(e)}
        >
            <input
                type="text"
                value={this.state.value}
                onChange={({ target }) => this.setState({ value: target.value })}
            />
            <button type="submit">send</button>
        </Form>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(MessageInput)