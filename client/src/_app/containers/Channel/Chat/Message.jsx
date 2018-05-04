import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { push } from 'react-router-redux'
import Time from '../../../lib/Time'

const mapState = ({ profiles }, { message }) => {
    return {
        profile: profiles[message.profileId]
    }
}

const mapDispatch = dispatch => {
    return {
        push: url => dispatch(push(url))
    }
}

const mergeProps = ( { profile }, { push }, ownProps) => {
    return {
        goToProfile: () => push(`/profile/${profile.id}`),
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

const Message = ({ message, profile, goToProfile }) => {
    const deleted = message === null
    const updated = message.createdAt !== message.updatedAt
    return <Li>
        <Article>
            <p>{deleted? '[deleted]' : message.text}</p>
            <a
                rel="noopener"
                href=""
                onClick={e => {
                    e.preventDefault()
                    goToProfile()
                }}
            >by {profile.name}</a>
            <p>sent <Time since={message.createdAt}/></p>
            {updated &&
                <p>{deleted? 'deleted': 'updated'} <Time since={message.updatedAt}/></p>
            }
        </Article>
    </Li>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)