import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { push } from 'react-router-redux'

import Time from '../../../lib/Time'

const mapState = ({ profiles, loading, errors }, { message }) => {
    return {
        profile: profiles[message.profileId],
        loading: loading.messages[message.id],
        error: errors.messages[message.id]
    }
}

const mapDispatch = dispatch => {
    return {
        push: url => dispatch(push(url))
    }
}

const mergeProps = (state, dispatch, ownProps) => {
    return {
        ...state, ...ownProps,
        onGoToProfile: () => dispatch.push(`/profile/${state.profile.id}`)
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
        if(this.props.isOwnMessage) return this.renderOwnMessage()

        const { message, profile, onGoToProfile } = this.props
        const { showTime } = this.state
        const deleted = message.text === null
        const updated = message.createdAt !== message.updatedAt
        
        return <Li
            onMouseOver={e => this.setState({ showTime: true })}
            onMouseLeave={e => this.setState({ showTime: false })}
        >
            <Content>
                <p>{deleted? '[deleted]': message.text}</p>
            </Content>
            <MetaData>
                <a
                    rel="noopener"
                    href=""
                    onClick={e => {
                        e.preventDefault()
                        onGoToProfile()
                    }}
                >{profile.name}</a>
                {showTime && <React.Fragment>
                    <p>sent <Time since={message.createdAt}/></p>
                    {updated &&
                        <p>{deleted? 'deleted': 'updated'} <Time since={message.updatedAt}/></p>
                    }
                </React.Fragment>}
            </MetaData>
        </Li>
    }
}

export default connect(mapState, mapDispatch, mergeProps)(Message)