import React from 'react'

import ListItem from 'material-ui/List/ListItem'
import { Link, NotificationPill } from '../../lib'

export default ({onClick, name, notifications, hasMore }) => {
    return <ListItem
        onClick={onClick}
    >
        <Link>{name}</Link>
        <NotificationPill count={notifications} hasMore={hasMore && notifications >= 20} />
    </ListItem>
}