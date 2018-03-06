import React from 'react'

import { Link } from './Link.css'

export default ({ onClick, children, ...rest}) => {
    return <a
        className={Link}
        rel="noopener"
        href=""
        {...rest}
        onClick={(e => {
            e.preventDefault()
            onClick && onClick(e)
        })}
    >
        {children}
    </a>
}
