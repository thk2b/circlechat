import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'

import { Spinner, Editable } from '../../lib'


import { Chat } from '../'
import css from './Channel.css'

const mapState = ({ channels, loading, errors }, ownProps) => {
    const { id } = ownProps.match.params
    const channel = channels[id]
    return {
        channel,
        loading: loading.channels[id],
        error: errors.channels[id],
    }
}

class Channel extends React.Component {
    render(){
        const {
            channel, loading,
        } = this.props

        if(loading) return <Spinner />
        
        if(!channel) return <div style={{ flex:1 }}>
            <Typography variant='title'>Channel not found</Typography>
        </div>

        return <div className={css.Channel}>
            <Chat channelId={channel.id}/>
        </div>
    }
}

export default connect(mapState)(Channel)
