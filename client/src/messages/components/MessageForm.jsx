import React from 'react'

import './styles/MessageForm.css'

export default class MessageForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text: ''
        }
    }
    handleSubmit(){
        this.props.onSubmit(this.state.text)
    }
    render(){
        const { text } = this.state
        return (
            <div className="MessageForm">
                <span className="form-container">
                    <input 
                        type="text"
                        value={ text }
                        onChange={ 
                            e => this.setState({ text: e.target.value })
                        }
                        onKeyDown={
                            e => e.key === 'Enter'? this.handleSubmit():null
                        }
                    />
                    <button
                        onClick={ this.handleSubmit() }
                        >post
                    </button>
                </span>
            </div>
        )
    }
}