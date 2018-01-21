import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ usersStats }) => {
    const { onlineUsersCount, connectionsCount } = usersStats
    return { onlineUsersCount, connectionsCount }
}

const UsersStats = ({ onlineUsersCount, connectionsCount }) => (
    <p>online: { onlineUsersCount } | total connections: { connectionsCount }</p>
)

export default connect(mapState)(UsersStats)