import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router'

import Typography from 'material-ui/Typography'
// import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import ClearIcon from 'material-ui-icons/Delete'

import { Editable } from '../../lib'
import { remove, update } from '../../../store/modules/channels'

const mapState = ({ channels }, ownProps) => {
    const channel = channels.data[ownProps.match.params.id]
    return {
        name: channel.name
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ remove, update }, dispatch)
}

const mergeProps = ( state, { remove, update }, ownProps ) => {
    const { id } = ownProps.match.params
    return {
        ...state,
        removeChannel: () => remove(id),
        renameChannel: name => update(id, { name }),
        ...ownProps
    }
}

const ChannelToolbar = ({ match, onBack }) => {
    const {
        name,
        renameChannel, removeChannel
    } = this.props
    return <div>
        {this.props.onBack && <ArrowBackIcon onClick={e => this.props.onBack() }/>}
        <Editable
            value={name}
            onSubmit={ newName => renameChannel(newName) }
        >
            <Typography variant='title'
                text={name}
            />
        </Editable>
        <IconButton onClick={ e => removeChannel() }>
            <ClearIcon />
        </IconButton>
    </div>
}

export default connect(mapState, mapDispatch, mergeProps)(ChannelToolbar)