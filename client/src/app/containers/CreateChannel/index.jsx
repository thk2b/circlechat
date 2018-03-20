import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack, push } from 'react-router-redux'

import { Toolbar, ToolbarTitle, ToolbarGroup } from 'material-ui/Toolbar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { create } from '../../../store/modules/channels'


const mapState = ({ profiles, channels }) => {
    return {
        profileId: profiles.ownProfileId,
        request: channels.request,
        loading: channels.laoding
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ create, goBack, push }, dispatch)
}

const mergeProps = ({ profileId, ...state }, { create, ...actions }, ownProps) => {
    return {
        ...ownProps, ...actions, ...state,
        createChannel: name => create({ profileId, name })
    }
}

class CreateChannel extends React.Component {
    constructor(props){
        super(props)
        this.state = { name: '' }
    }
    
    submit = () => {
        if(!this.state.name) return
        this.props.createChannel(this.state.name)
    }
    render(){
        return <div style={{ flex: 1 }}>
            <Toolbar>
                <ToolbarGroup>
                    create a channel
                </ToolbarGroup>
            </Toolbar>
            <TextField
                fullWidth
                value={this.state.name}
                floatingLabelText='name'
                onChange={({ target }) => this.setState({ name: target.value })}
                onKeyDown={({ key }) => key === 'Enter' && this.submit()}
            />
            <RaisedButton
                primary
                label='create'
                onClick={e => this.submit()}
            />
            <FlatButton 
                label='cancel'
                onClick={e => this.props.goBack()}
            />
            {/* <RequestStatus request={this.props.request}/> */}
        </div>
    }
}
export default connect(mapState, mapDispatch, mergeProps)(CreateChannel)