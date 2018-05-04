import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import MdDelete from 'react-icons/lib/md/delete'
import MdEdit from 'react-icons/lib/md/edit'

import { messagesActions } from '../../../../store/modules/messages'
import { push } from 'react-router-redux'
import Time from '../../../lib/Time'

const mapState = ({ profiles }, { message }) => {
    return {
        profile: profiles[message.profileId]
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

const mergeProps = ( { profile }, { push, update, remove }, ownProps) => {
    return {
        onGoToProfile: () => push(`/profile/${profile.id}`),
        onUpdateMessage: text => update(ownProps.message.id, { text }),
        onDeleteMessage: () => remove(ownProps.message.id),
        profile,
        ...ownProps
    }
}

const Li = styled.li`
    padding: 10px;
`

const Article = styled.article`
    padding: 10px;
    border-radius: 3px;
    display: flex;
    flex-flow: column nowrap;
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

class Message extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editing: false,
            showIcons: false,
            editValue: this.props.message.text
        }
    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.message.text !== this.props.message.text){
            this.setState({ editValue: this.props.message.text })
        }
    }
    
    handleMouseOver(){
        if(!this.state.editing){
            this.setState({ showIcons: true })
        }
    }
    handleMouseLeave(){
        if(this.state.showIcons){
            this.setState({ showIcons: false })
        }
    }
    handleStartEdit(){
        if(this.props.message.text === null) return //message was deleted
        this.setState({
            editing: true
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
        const { message, profile, onGoToProfile, onDeleteMessage, onUpdateMessage } = this.props
        const { editing, editValue, showIcons } = this.state
        const deleted = message.text === null
        const updated = message.createdAt !== message.updatedAt

        return <Li>
            <Article
                onMouseOver={e => this.handleMouseOver(e)}
                onMouseLeave={e => this.handleMouseLeave(e)}
            >
                {editing
                    ? <Row>
                        <input
                            type="text"
                            value={editValue}
                            onChange={e => this.setState({ editValue: e.target.value })}
                        />
                        <button
                            onClick={e => this.handleSubmit({})}
                        >save</button>
                        <button
                            onClick={e => this.handleCancel()}
                        >cancel</button>
                    </Row>
                    : <Row>
                        <p>{deleted? '[deleted]': message.text}</p>
                        {showIcons && <p>
                            <MdEdit onClick={e => this.handleStartEdit(e)}/>
                            <MdDelete onClick={e => this.handleDelete(e)}/>
                        </p>}
                    </Row>
                }
                <Row>
                    <a
                        rel="noopener"
                        href=""
                        onClick={e => {
                            e.preventDefault()
                            onGoToProfile()
                        }}
                    >by {profile.name}</a>
                    <p>sent <Time since={message.createdAt}/></p>
                    {updated &&
                        <p>{deleted? 'deleted': 'updated'} <Time since={message.updatedAt}/></p>
                    }
                </Row>
            </Article>
        </Li>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(Message)