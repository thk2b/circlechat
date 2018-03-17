import React from 'react'
import { connect } from 'react-redux'
import { MdClear } from 'react-icons/lib/md'
import { bindActionCreators } from 'redux'

// import Toolbar from 'material-ui/Toolbar'
import { ContextMenu, Spinner, Editable } from '../../lib'

import { remove, update } from '../../../store/modules/channels'

import { Chat } from '../'
import css from './Channel.css'

const mapState = ({ channels }, ownProps) => {
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
        renameChannel: name => update(id, { name })
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
            {/* <ContextMenu>
                <Editable
                    as='span'
                    value={channel.name}
                    onSubmit={ name => renameChannel(name) }
                />
                <MdClear onClick={ e => removeChannel() }/>
            </ContextMenu> */}
            <Chat channelId={channel.id}/>
        </div>
    }
}


export default connect(mapState, mapDispatch, mergeProps)(Channel)
