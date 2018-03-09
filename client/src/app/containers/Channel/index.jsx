import React from 'react'
import { connect } from 'react-redux'

import { ContextMenu, Spinner } from '../../lib'

import css from './Channel.css'

const mapState = ({ channels }, ownProps) => {
    console.log(ownProps.match)
    if(!ownProps.match.params.id){
        console.error('Channel must be rendered by a `Route` with an id param')
    }
    const channel = channels.data[ownProps.match.params.id]
    return {
        channel,
        loading: channels.loading
    }
}

const mapDispatch = dispatch => {
    return {}
}

class Channel extends React.Component {
    render(){
        const { channel, loading } = this.props
        
        if(loading) return <Spinner />
        
        if(!channel) return <div>
            <h1>Channel not found</h1>
        </div>

        return <div className={css.Channel}>
            <ContextMenu>
                {channel.name}
            </ContextMenu>
        </div>
    }
}


export default connect(mapState, mapDispatch)(Channel)