import React from 'react'

import { ListItem, ListItemText } from 'material-ui/List'
import { Link, NotificationPill } from '../../lib'

import css from './ChannelListItem.css'

export default ({onClick, name, notifications, hasMore }) => {
    return <ListItem button
        onClick={onClick}
    >
        <ListItemText primary={name}/>
        <NotificationPill count={notifications} hasMore={hasMore && notifications >= 20} />
        {/* <div className={css.ChannelListItem}>
            <ListItemText primaty={name}/>
            <Link>{name}</Link>
            <NotificationPill count={notifications} hasMore={hasMore && notifications >= 20} />
        </div> */}
    </ListItem>
}