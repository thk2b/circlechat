import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import MdMoreVert from 'react-icons/lib/md/more-vert'
import MdEdit from 'react-icons/lib/md/edit'
import MdDelete from 'react-icons/lib/md/delete'
import MdCheck from 'react-icons/lib/md/check'
import MdClose from 'react-icons/lib/md/close'
import Popover from '@thk2b/oui/lib/Popover'
import Editable from '@thk2b/oui/lib/Editable'

import { channelsActions } from '../../../store/modules/channels'
import Menu from '../../lib/Menu'
import InputGroup from '../../lib/InputGroup'

const mapState = ({ channels, ownProfileId }, { match }) => {
    const channel = channels[match.params.id]
    return {
        channel,
        isOwnChannel: channel&&channel.profileId === ownProfileId
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
        onRename: name => update(id, { name }),
        ...ownProps
    }
}

const Header = styled.header`
    display: flex;
    justify-content: space-between;

`

class ChannelHeader extends React.Component {
    render(){
        const { channel, isOwnChannel, onRenameChannel, onRemove } = this.props

        if(!channel) return <header>
            <h2>channel not found</h2>
        </header>

        return <header>
            <InputGroup>
                <Editable
                    value={this.props.channel.name}
                    onSubmit={name => this.props.onRename(name)}
                    onDelete={() => this.props.onRemove()}

                    As={({ value, ...props}) => <h2>{ value }</h2>}
                    With={ props => <input {...props} />}
                    EditButton={p => <button {...p}>
                        <MdEdit size={22} />
                    </button>}
                    DeleteButton={p => <button {...p}>
                        <MdDelete size={22} />
                    </button>}
                    SubmitButton={p => <button {...p}>
                        <MdCheck size={22} />
                    </button>}
                    CancelButton={p => <button {...p}>
                        <MdClose size={22} />
                    </button>}
                />
            </InputGroup>
        </header>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(ChannelHeader)