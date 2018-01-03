import React from 'react'
import { connect } from 'react-redux'

import { MessageList, MessageForm } from '../components'
import { fetchMessages, submitMessage } from '../actions'
import './Messages.css'

class Messages extends React.PureComponent {
    componentDidMount(){
        this.props.fetchMessages()
    }

    render(){
        const { messages, submitMessage } = this.props
        return (
            <div className="Messages">
                <MessageList messages={ messages }/>
                <MessageForm onSubmit={ text => submitMessage( text ) }/>
            </div>
        )
    }
}

function mapStateToProps({ messages }){
    return { 
        messages: Object.keys(messages).map( id => messages[id] )
    }
}

function mapDispatchToProps( dispatch ){
    return {
        fetchMessages: () => dispatch(fetchMessages()),
        submitMessage: text => dispatch(submitMessage(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages)