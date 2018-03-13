import React from 'react'

import css from './NotificationPill.css'

export default ({ count, hasMore }) => {
    if(! count ) return null
    return <span className={css.NotificationPill} >
        { hasMore && '+'}{ count }
    </span>
}