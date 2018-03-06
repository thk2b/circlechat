import React from 'react'

import { Link, Status } from '../../lib'

export default ({onClick, name, status, ...rest}) => {
    return <li onClick={onClick}
        {...rest}
    >
        <Link>
            <span>{name}</span>
            <Status status={status}/>
        </Link>
    </li>
}
