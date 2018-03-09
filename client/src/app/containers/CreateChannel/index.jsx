import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { create } from '../../../store/modules/channels'
import { Input, InputWithButtons } from '../../lib'

const mapState = ({ profiles }) => {
    return {
        profileId: profiles.ownProfileId
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ create }, dispatch)
}

const mergeProps = ({ profileId }, { create }, ownProps) => {
    return {
        ...ownProps,
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
        return <div>
        <InputWithButtons>
            <Input
                value={this.state.name}
                onChange={name => this.setState({ name })}
                onKeyDown={({ key }) => key === 'Enter' && this.submit()}
            />
        </InputWithButtons>
    </div>
    }
}
export default connect(mapState, mapDispatch, mergeProps)(CreateChannel)