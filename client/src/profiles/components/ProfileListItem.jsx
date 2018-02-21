import React from 'react'

import Link from '../../lib/components/Link'

export default ({onClick, name, ...rest}) => {
    return <li onClick={onClick}
        {...rest}
    >
        <Link >
            <span>{name}</span>
        </Link>
    </li>
}
