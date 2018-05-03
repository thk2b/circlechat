import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ profiles }, { message }) => {
    return {
        profile: profiles[message.profileId]
    }
}

const Message = ({ message, profile }) => {
    return <li>
        <article>
            <p>{message.text}</p>
            <a href="">by {profile.name}</a>
        </article>
    </li>
}

export default connect(mapState)(Message)