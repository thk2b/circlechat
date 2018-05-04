import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { push } from 'react-router-redux'

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
    return <Li>
        <Article>
            <p>{message.text}</p>
            <a
                rel="noopener"
                href=""
                onClick={e => {
                    e.preventDefault()
                    goToProfile()
                }}
            >by {profile.name}</a>
        </Article>
    </Li>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)