import React from 'react'

import { Link, Status } from '../../lib'

export default ({onClick, name, notifications }) => {
    return <li onClick={onClick} >
        <Link>
            <span>{name}</span>
            <Status />
            <span>{notifications}</span>
        </Link>
    </li>
}
