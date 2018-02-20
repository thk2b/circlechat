import React from 'react'

export default ({ onClick, children, ...rest}) => {
    return <a
        rel="noopener"
        href=""
        {...rest}
        onClick={(e => {
            e.preventDefault()
            onClick(e)
        })}
    >
        {children}
    </a>
}
