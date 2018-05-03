import React from 'react'
import { connect } from 'react-redux'

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
        return <form
            onSubmit={e => this.handleSend(e)}
        >
            <input
                type="text"
                value={this.state.value}
                onChange={({ target }) => this.setState({ value: target.value })}
            />
            <button type="submit">send</button>
        </form>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(MessageInput)