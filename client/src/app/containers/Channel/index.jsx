import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Toolbar, ToolbarTitle, ToolbarGroup } from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
// import Snackbar from 'material-ui/Snackbar'
import ClearIcon from 'material-ui/svg-icons/action/delete'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import { Spinner, Editable } from '../../lib'

import { remove, update } from '../../../store/modules/channels'

import { Chat } from '../'
import css from './Channel.css'

const mapState = ({ channels }, ownProps) => {
    console.log(ownProps)
    if(!ownProps.match.params.id){
        console.error('Channel must be rendered by a `Route` with an id param')
    }
    const channel = channels.data[ownProps.match.params.id]
    return {
        channel,
        loading: channels.loading || channels.request.status === null
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

class Channel extends React.Component {
    render(){
        const {
            channel, loading,
            clearNotifications, renameChannel, removeChannel
        } = this.props
        
        if(loading) return <Spinner />
        
        if(!channel) return <div>
            <h1>Channel not found</h1>
        </div>

        return <div className={css.Channel}>
            <Toolbar>
                {this.props.onBack && <ToolbarGroup>
                    <BackIcon onClick={e => this.props.onBack() }/>
                </ToolbarGroup>}
                <ToolbarGroup>
                    <Editable
                        value={channel.name}
                        onSubmit={ name => renameChannel(name) }
                    >
                        <ToolbarTitle
                            text={channel.name}
                        />
                    </Editable>
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconButton onClick={ e => removeChannel() }>
                        <ClearIcon />
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
            <Chat channelId={channel.id}/>
            {/* {channel.request.status >= 400 && <Snackbar
                open={true}
                message={channel.request.message}
                autoHideDuration={4000}
            />} */}
        </div>
    }
}


export default connect(mapState, mapDispatch, mergeProps)(Channel)
