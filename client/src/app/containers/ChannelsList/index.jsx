import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { getAll } from '../../../store/modules/channels'

const mapState = ({ channels }) => {
    return {
        channels: Object.entries(channels.data).map(
            ([_, channel]) => channel
        ),
        request: channels.request
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ getAll, push }, dispatch)
}

class ChannelsList extends React.Component {
    componentDidMount = () => {
        if(this.props.request.status === null){
            this.props.getAll()
        }
    }
    
    render(){
        return <div>
            {JSON.stringify(this.props.channels)}
            <button onClick={e => this.props.push('/c/create')}>create</button>
        </div>
    }
}

export default connect(mapState, mapDispatch)(ChannelsList)
