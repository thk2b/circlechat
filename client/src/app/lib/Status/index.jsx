import React from 'react'
import classNames from 'classnames'

import css from './Status.css'

export default ({ status = 'INVISIBLE' }) => {
    if(status === 'INVISIBLE') return null
    const modifierClassName = {
        'ONLINE': css.isOnline,
        'OFFLINE': css.isOffline
    }[status]

    return <span className={classNames(css.Status, modifierClassName)}>
        
    </span>
}
