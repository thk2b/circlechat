import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const mapState = ({ profiles }, { message }) => {
    return {
        profile: profiles[message.profileId]
    }
}

const Li = styled.li`
    padding: 10px;
`

const Article = styled.article`
    border: 1px solid #909192;
    background-color: #444546;
    padding: 10px;
    border-radius: 3px;
`


const Message = ({ message, profile }) => {
    return <Li>
        <Article>
            <p>{message.text}</p>
            <a href="">by {profile.name}</a>
        </Article>
    </Li>
}

export default connect(mapState)(Message)