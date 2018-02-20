import React from 'react'

import Link from '../../lib/components/Link'

export default ({onClick, name, ...rest}) => {
    return <li
        {...rest}
    >
        <Link onClick={onClick}>
            <span>{name}</span>
        </Link>
    </li>
}
