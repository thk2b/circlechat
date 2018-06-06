import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import MdDelete from 'react-icons/lib/md/delete'
import MdEdit from 'react-icons/lib/md/edit'
import MdCheck from 'react-icons/lib/md/check'
import MdClose from 'react-icons/lib/md/close'
import Editable from '@thk2b/oui/lib/Editable'

import InputGroup from '../../../lib/InputGroup'
import LoadingBar from '../../../lib/LoadingBar'
import { messagesActions } from '../../../../store/modules/messages'
import { push } from 'react-router-redux'
import Time from '../../../lib/Time'

const mapState = ({ profiles, loading, errors, ownProfileId }, { message }) => {
    return {
        profile: profiles[message.profileId],
        loading: loading.messages[message.id],
        error: errors.messages[message.id],
    }
}

const mapDispatch = dispatch => {
    return {
        ...bindActionCreators({
            update: messagesActions.update,
            remove: messagesActions.remove,
            push
        }, dispatch)
    }
}

const mergeProps = ( { profile, ...state }, { push, update, remove }, ownProps) => {
    return {
        onGoToProfile: () => push(`/profile/${profile.id}`),
        onUpdateMessage: text => update(ownProps.message.id, { text }),
        onDeleteMessage: () => remove(ownProps.message.id),
        profile,
        ...state,
        ...ownProps
    }
}

const Li = styled.li`
    position: relative;
    flex-shrink: 0;
    padding: 10px;
    display: inline-flex;
    flex-flow: column nowrap;
    justify-content: space-between;
`
const OwnMessage = Li.extend`
    align-self: flex-end;
    align-items: flex-end;
`

const Content = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
`
const MetaData = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    & a, & p {
        font-size: inherit;
    }
    & > *:not(:last-child)::after {
        content: " | ";
        text-decoration: none;
        white-space: pre;
        display: inline-block;
    }
`


const Message = ({ message, onGoToProfile, onUpdateMessage, onDeleteMessage, loading }) => {
    const deleted = message.text === null
    const updated = message.createdAt !== message.updatedAt

    return <OwnMessage>
        {loading&&<LoadingBar/>}
        <Content>
            <InputGroup>
                <Editable
                    value={deleted? '[deleted]': message.text}
                    onSubmit={value => onUpdateMessage(value)}
                    onDelete={value => onDeleteMessage()}
                    As={({ value, ...props }) => <p {...props}>{ value }</p>}
                    With={props => <input {...props} />}
                    EditButton={p => <button
                        style={{ backgroundColor: 'transparent'}}
                        {...p}
                    >
                        <MdEdit size={22}/>
                    </button>}
                    DeleteButton={p => <button
                            style={{ backgroundColor: 'transparent'}}
                            {...p}
                        >
                        <MdDelete size={22}/>
                    </button>}
                    CancelButton={p => <button {...p}>
                        <MdClose size={22}/>
                    </button>}
                    SubmitButton={p => <button {...p}>
                        <MdCheck size={22}/>
                    </button>}
                />
            </InputGroup>
        </Content>
        <MetaData>
            <p>sent <Time since={message.createdAt}/></p>
            {updated &&
                <p>{deleted? 'deleted': 'updated'} <Time since={message.updatedAt}/></p>
            }
            <a
                rel="noopener"
                href=""
                onClick={e => {
                    e.preventDefault()
                    onGoToProfile()
                }}
            >you</a>
        </MetaData>
        
    </OwnMessage>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)