import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { goBack } from 'react-router-redux'
import { channelsActions } from '../../../store/modules/channels'

const mapState = ({ profiles, loading, errors, ownProfileId }) => {
    return {
        profileId: ownProfileId,
        loading: loading.channels.new,
        error: errors.channels.new
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        create: channelsActions.create,
        goBack
    }, dispatch)
}

const mergeProps = ({ profileId, ...state }, { create, ...actions }, ownProps) => {
    return {
        ...ownProps, ...actions, ...state,
        onCreate: name => create({ profileId, name })
    }
}

class CreateChannel extends React.Component {
    constructor(props){
        super(props)
        this.state = { name: '' }
    }
    render(){
        const { onCreate, goBack } = this.props
        const { name } = this.state

        return <main>
            <h2>Create a channel</h2>
            <input
                type="text"
                value={name}
                onChange={({ target }) => this.setState({ name: target.value })}
            />
            <button
                onClick={e => onCreate(name)}
            >create</button>
            <button
                onClick={e => goBack()}
            >cancel</button>
        </main>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(CreateChannel)