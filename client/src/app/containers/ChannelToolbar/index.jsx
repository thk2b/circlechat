import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router'

import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import ClearIcon from 'material-ui-icons/Delete'

import { Editable } from '../../lib'
import { remove, update } from '../../../store/modules/channels'
import { typography } from 'material-ui/styles';

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between'
    }
})

const mapState = ({ channels }, ownProps) => {
    const channel = channels.data[ownProps.match.params.id]
    return {
        name: channel && channel.name
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

const ChannelToolbar = ({
    classes,
    name,
    onBack,
    renameChannel,
    removeChannel
}) => {
    return <div
        className={classes.root}
    >
        {onBack && <ArrowBackIcon onClick={e => onBack() }/>}
        <Editable
            value={name}
            onSubmit={ newName => renameChannel(newName) }
        >
            <Typography variant='title'>
                {name}
            </Typography>
        </Editable>
        <IconButton onClick={ e => removeChannel() }>
            <ClearIcon />
        </IconButton>
    </div>
}

export default withStyles(styles)(connect(mapState, mapDispatch, mergeProps)(ChannelToolbar))