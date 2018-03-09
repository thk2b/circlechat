import React from 'react'

import { Link, Status } from '../../lib'

export default ({onClick, name, notifications, ...rest}) => {
    return <li onClick={onClick}
        {...rest}
    >
        <Link>
            <span>{name}</span>
            <Status />
        </Link>
    </li>
}
