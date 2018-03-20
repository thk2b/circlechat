import React from 'react'

import ListItem from 'material-ui/List/ListItem'
import { Link, NotificationPill } from '../../lib'

import css from './ChannelListItem.css'

export default ({onClick, name, notifications, hasMore }) => {
    return <ListItem
        onClick={onClick}
    >
        <div className={css.ChannelListItem}>
            <Link>{name}</Link>
            <NotificationPill count={notifications} hasMore={hasMore && notifications >= 20} />
        </div>
    </ListItem>
}