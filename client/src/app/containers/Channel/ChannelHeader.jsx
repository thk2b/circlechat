import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import MdMoreVert from 'react-icons/lib/md/more-vert'
import Popover from '@thk2b/oui/lib/Popover'

import { channelsActions } from '../../../store/modules/channels'
import Menu from '../../lib/Menu'

const mapState = ({ channels }, { match }) => {
    return {
        channel: channels[match.params.id]
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({
        remove: channelsActions.remove,
        update: channelsActions.update
    }, dispatch)
}

const mergeProps = ( state, { remove, update }, ownProps ) => {
    const { id } = ownProps.match.params
    return {
        ...state,
        onRemove: () => remove(id),
        onRenameChannel: name => update(id, { name }),
        ...ownProps
    }
}

const Header = styled.header`
    display: flex;
    justify-content: space-between;

`

class ChannelHeader extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editingName: ''
        }
    }
    handleStartEdit(){
        this.setState({
            editing: true, editingName: this.props.channel.name
        })
    }
    handleSubmit(){
        this.props.onRenameChannel(this.state.editingName)
        this.setState({ editingName: '', editing: false })
    }
    handleCancel(){
        this.setState({ editingName: '', editing: false })
    }
    render(){
        const { channel, onRemove } = this.props
        const { editing, editingName } = this.state
        
        if(!channel) return <header>
            <h2>channel not found</h2>
        </header>

        if(!editing) return <Header>
            <h2>{channel.name}</h2>
            <Popover
                zIndex={1}
                Component={() => <MdMoreVert size={32} height='100%'/>}
                position={{ right: 0 }}
            >
                <Menu.Container>
                    <Menu.Item>
                        <button onClick={e => this.handleStartEdit()}>edit</button>
                    </Menu.Item>
                    <Menu.Item>
                        <button onClick={e => onRemove()}>remove</button>
                    </Menu.Item>
                </Menu.Container>
            </Popover>
        </Header>
        
        return <Header>
            <input
                type="text"
                value={editingName}
                onChange={e => this.setState({ editingName: e.target.value })}
            />
            <button
                onClick={e => this.handleSubmit({})}
            >save</button>
            <button
                onClick={e => this.handleCancel()}
            >cancel</button>
        </Header>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(ChannelHeader)