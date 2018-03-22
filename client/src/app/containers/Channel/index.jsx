import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'

import { Spinner, Editable } from '../../lib'


import { Chat } from '../'
import css from './Channel.css'

const mapState = ({ channels }, ownProps) => {
    const channel = channels.data[ownProps.match.params.id]
    return {
        channel,
        loading: channels.loading || channels.request.status === null
    }
}

class Channel extends React.Component {
    render(){
        const {
            channel, loading,
        } = this.props
        
        if(loading) return <Spinner />
        
        if(!channel) return <div>
            <h1>Channel not found</h1>
        </div>

        return <div className={css.Channel}>
            <Chat channelId={channel.id}/>
            {/* {channel.request.status >= 400 && <Snackbar
                open={true}
                message={channel.request.message}
                autoHideDuration={4000}
            />} */}
        </div>
    }
}


export default connect(mapState)(Channel)
