import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack, push } from 'react-router-redux'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import { create } from '../../../store/modules/channels'

const styles = theme => ({
    root: {
        flex: 1,
        backgroundColor: theme.palette.background.default,
        padding: '8px'
    }
})

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
        const { classes } = this.props
        return <div
            className={classes.root}
        >
            <TextField
                fullWidth
                margin='normal'
                value={this.state.name}
                label='name'
                onChange={({ target }) => this.setState({ name: target.value })}
                onKeyDown={({ key }) => key === 'Enter' && this.submit()}
            />
            <Button
                primary
                variant='raised'
                onClick={e => this.submit()}
            >
                create
            </Button>
            <Button 
                onClick={e => this.props.goBack()}
            >
                cancel
            </Button>
            {/* <RequestStatus request={this.props.request}/> */}
        </div>
    }
}
export default withStyles(styles)(connect(mapState, mapDispatch, mergeProps)(CreateChannel))