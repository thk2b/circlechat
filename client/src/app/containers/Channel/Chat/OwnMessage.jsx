import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import MdDelete from 'react-icons/lib/md/delete'
import MdEdit from 'react-icons/lib/md/edit'
import MdCheck from 'react-icons/lib/md/check'
import MdClose from 'react-icons/lib/md/close'

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

class Message extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editing: false,
            showIcons: false,
            showTime: false,
            editValue: this.props.message.text
        }
    }
    handleMouseOver(){
        if(!this.state.editing){
            this.setState({ showIcons: true, showTime: true })
        }

    }
    handleMouseLeave(){
        if(this.state.showIcons){
            this.setState({ showIcons: false , showTime: false })
        }
    }
    handleStartEdit(){
        if(this.props.message.text === null) return //message was deleted
        this.setState({
            editing: true,
            editValue: this.props.message.text
        })
    }
    handleDelete(){
        this.props.onDeleteMessage()
    }
    handleSubmit(){
        this.props.onUpdateMessage(this.state.editValue)
        this.setState({ editValue: '', editing: false })
    }
    handleCancel(){
        this.setState({ editValue: '', editing: false })
    }
    render(){
        const { message, onGoToProfile, loading } = this.props
        const { editing, editValue, showIcons, showTime } = this.state
        const deleted = message.text === null
        const updated = message.createdAt !== message.updatedAt

        return <OwnMessage
            onMouseOver={e => this.handleMouseOver(e)}
            onMouseLeave={e => this.handleMouseLeave(e)}
        >
            {loading&&<LoadingBar/>}
            <Content>
                {editing
                    ? <InputGroup>
                        <input
                            type="text"
                            value={editValue}
                            onChange={e => this.setState({ editValue: e.target.value })}
                        />
                        <button
                            onClick={e => this.handleSubmit({})}
                        ><MdCheck size={22}/></button>
                        <button
                            onClick={e => this.handleCancel()}
                        ><MdClose size={22}/></button>
                    </InputGroup>
                    : <React.Fragment>
                        {showIcons && <p>
                            <MdEdit onClick={e => this.handleStartEdit(e)}/>
                            <MdDelete onClick={e => this.handleDelete(e)}/>
                        </p>}
                        <p>{deleted? '[deleted]': message.text}</p>
                    </React.Fragment>
                }
            </Content>
            <MetaData>
                {showTime && <React.Fragment>
                    <p>sent <Time since={message.createdAt}/></p>
                    {updated &&
                        <p>{deleted? 'deleted': 'updated'} <Time since={message.updatedAt}/></p>
                    }
                </React.Fragment>}
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
}

export default connect(mapState, mapDispatch, mergeProps)(Message)