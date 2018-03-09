import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack, push } from 'react-router-redux'
import MdCheck from 'react-icons/lib/md/check'
import MdClear from 'react-icons/lib/md/clear'

import { create } from '../../../store/modules/channels'
import { Input, Button, InputWithButtons, RequestStatus } from '../../lib'

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
        console.log(this.props.request)
        return <div>
            <h2>create a channel</h2>
            <InputWithButtons>
                <Input
                    value={this.state.name}
                    placeholder={'name'}
                    onChange={name => this.setState({ name })}
                    onKeyDown={({ key }) => key === 'Enter' && this.submit()}
                />
                <Button onClick={e => this.submit()}>
                    <MdCheck />
                </Button>
                <Button onClick={e => this.props.goBack()}>
                    <MdClear />
                </Button>
            </InputWithButtons>
            <RequestStatus request={this.props.request}/>
        </div>
    }
}
export default connect(mapState, mapDispatch, mergeProps)(CreateChannel)