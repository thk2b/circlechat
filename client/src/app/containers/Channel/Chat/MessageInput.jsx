import React from 'react'
import styled from 'styled-components'

const Form = styled.form`
    display: flex;
    padding: 10px;
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

export default class MessageInput extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: ''
        }
    }
    handleSend(e){
        e.preventDefault()
        if(!this.state.value) return
        this.props.onSubmit(this.state.value)
        this.setState({ value: ''})
    }
    render(){
        return <Form
            onSubmit={e => this.handleSend(e)}
        >
            <input
                type="text"
                value={this.state.value}
                onClick={e => this.props.onFocus(e)}
                onChange={({ target }) => this.setState({ value: target.value })}
            />
            <button type="submit">send</button>
        </Form>
    }
}