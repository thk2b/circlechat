import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import MdAddCircle from 'react-icons/lib/md/add-circle'

import { Link } from '../../lib'
import { getAll } from '../../../store/modules/channels'

import ChannelListItem from './ChannelListItem'

const mapState = ({ channels }) => {
    return {
        channels: Object.entries(channels.data).map(
            ([_, channel]) => channel
        ),
        request: channels.request
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ getAll, push }, dispatch)
}

class ChannelsList extends React.Component {
    componentDidMount = () => {
        if(this.props.request.status === null){
            this.props.getAll()
        }
    }
    render(){
        const { channels, push } = this.props
        return channels.map(
            channel => <ChannelListItem
                onClick={e => push(`/channel/${channel.id}`)}
                {...channel}
            />
        ).concat(<Link
            key='__createLink'
            onClick={e => push('/channel/create')}
            ><MdAddCircle/>
        </Link>)
    }
}

export default connect(mapState, mapDispatch)(ChannelsList)
