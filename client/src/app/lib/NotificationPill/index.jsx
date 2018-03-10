import React from 'react'

import css from './NotificationPill.css'

export default ({ count }) => {
    if(! count ) return null
    return <span className={css.NotificationPill} >
        { count }
    </span>
}