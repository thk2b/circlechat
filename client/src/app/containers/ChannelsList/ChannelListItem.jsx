import React from 'react'

import { Link, NotificationPill } from '../../lib'

import css from './ChannelListItem.css'

export default ({onClick, name, notifications }) => {
    return <li
        onClick={onClick}
        className={css.ChannelListItem}
    >
        <Link>{name}</Link>
        <NotificationPill count={notifications} />
    </li>
}