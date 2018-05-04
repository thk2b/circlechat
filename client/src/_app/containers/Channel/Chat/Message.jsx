import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'

import { messagesActions } from '../../../../store/modules/messages'
import { push } from 'react-router-redux'
import Time from '../../../lib/Time'
import Menu from '../../../lib/Menu'

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
        onUpdateMessage: text => update(ownProps.id, { text }),
        onDeleteMessage: () => remove(ownProps.id),
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
`

const MetaDataContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

`

const Message = ({ message, profile, onGoToProfile, onDeleteMessage, onUpdateMessage }) => {
    const deleted = message === null
    const updated = message.createdAt !== message.updatedAt
    return <Li>
        <Article>
            <p>{deleted? '[deleted]' : message.text}</p>
            <MetaDataContainer>
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
            </MetaDataContainer>
        </Article>
    </Li>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)