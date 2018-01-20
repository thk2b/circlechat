import React from 'react'
import { connect } from 'react-redux'

const mapState = state => ({
    onlineUsersCount: state.usersStats.onlineUsersCount
})

const UsersStats = ({ onlineUsersCount }) => (
    <div>
        <p>now online: { onlineUsersCount }</p>
    </div>
)

export default connect(mapState)(UsersStats)