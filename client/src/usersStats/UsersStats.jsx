import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ usersStats }) => {
    const { onlineUsersCount, connectionsCount } = usersStats
    return { onlineUsersCount, connectionsCount }
}

const UsersStats = ({ onlineUsersCount, connectionsCount }) => (
    <div>
        <p>now online: { onlineUsersCount }</p>
        <p>total connections: { connectionsCount }</p>
    </div>
)

export default connect(mapState)(UsersStats)