import React from 'react'
import OnlineStatus from './OnlineStatus'

export default ({ profile }) => {
    return <React.Fragment>
        <h1>{profile.name}</h1>
        <h2>@{profile.userId}{profile.status==='ONLINE'&&<OnlineStatus/>}</h2>
        <p>About</p>
        <p>{profile.description||'no description yet'}</p>
    </React.Fragment>
}