import React from 'react'
import styled from 'styled-components'
import MdSend from 'react-icons/lib/md/send'

import LabeledIcon from '../../../lib/LabeledIcon'

const Form = styled.form`
    display: flex;
    background-color: transparent !important;
    padding: 8px;
    & input {
        padding: 15px;
        flex: 1;
        border: none !important;
        background-color: transparent !important;
    }
    & button {
        background-color: transparent !important;
        border: none !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        border-top-right-radius: 0 !important;

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
        return <footer>
            <Form
                onSubmit={e => this.handleSend(e)}
            >
                <input
                    type="text"
                    value={this.state.value}
                    onClick={e => this.props.onFocus(e)}
                    onChange={({ target }) => this.setState({ value: target.value })}
                />
                <button type="submit">
                    <LabeledIcon
                        labelText="send"
                        Icon={() => <MdSend size={32}/>}
                    />
                </button>
            </Form>
        </footer>
    }
}